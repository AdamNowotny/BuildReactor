import Rx from 'rx/dist/rx.testing';
import eventProcessor from 'core/services/buildEventProcessor';
import events from 'core/events';
import serviceView from 'core/services/serviceView';
import sinon from 'sinon';

describe('core/services/serviceView', () => {

    const serviceUpdatedSubject = new Rx.Subject();
    const serviceUpdateFailedSubject = new Rx.Subject();
    const servicesInitializingSubject = new Rx.Subject();

    beforeEach(() => {
        sinon.stub(events, 'getByName');
        sinon.stub(events, 'push');
        sinon.stub(eventProcessor, 'process');
        events.getByName.onCall(0).returns(serviceUpdatedSubject);
        events.getByName.onCall(1).returns(serviceUpdateFailedSubject);
        events.getByName.onCall(2).returns(servicesInitializingSubject);
        serviceView.init();
        events.push.reset();
    });

    afterEach(() => {
        serviceView.dispose();
        events.push.restore();
        eventProcessor.process.restore();
        events.getByName.restore();
    });

    describe('serviceUpdated', () => {

        it('should update state on serviceUpdated', () => {
            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service1',
                details: [{
                    id: 'abc'
                }]
            });

            sinon.assert.calledOnce(events.push);
            sinon.assert.calledWith(events.push, {
                eventName: 'stateUpdated',
                source: 'serviceView',
                details: [{
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        error: null
                    }]
                }]
            });
        });

        it('should sort builds on serviceUpdated', () => {
            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service1',
                details: [
                    { id: 'zzz' },
                    { id: 'abc' },
                ]
            });

            sinon.assert.calledOnce(events.push);
            sinon.assert.calledWith(events.push, {
                eventName: 'stateUpdated',
                source: 'serviceView',
                details: [{
                    name: 'service1',
                    items: [
                        { id: 'abc', error: null },
                        { id: 'zzz', error: null }
                    ]
                }]
            });
        });

        it('should process build events when old state unknown', () => {
            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service1',
                details: [{
                    id: 'abc',
                    isBroken: true
                }]
            });

            sinon.assert.calledWith(eventProcessor.process, {
                oldState: {
                    name: 'service1',
                    items: []
                },
                newState: {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: true,
                        error: null
                    }]
                }
            });
        });

        it('should process build events and mix in old values', () => {
            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service1',
                details: [{
                    id: 'abc',
                    isBroken: true
                }]
            });
            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service1',
                details: [{
                    id: 'abc',
                    error: { message: 'error' }
                }]
            });

            sinon.assert.calledWith(eventProcessor.process, {
                oldState: {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: true,
                        error: null
                    }]
                },
                newState: {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        error: { message: 'error' },
                        isBroken: true
                    }]
                }
            });
        });

    });

    it('should mark builds as offline on serviceUpdateFailed', () => {
        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service1',
            details: [{
                id: 'abc'
            }]
        });
        serviceUpdateFailedSubject.onNext({
            eventName: 'serviceUpdateFailed',
            source: 'service1',
            details: { message: 'some error' }
        });

        sinon.assert.calledWith(events.push, {
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [{
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: {
                        message: 'Service update failed',
                        description: 'some error'
                    }
                }]
            }]
        });
    });

    describe('servicesInitializing', () => {

        it('should reset state on servicesInitializing', () => {
            servicesInitializingSubject.onNext({
                eventName: 'servicesInitializing',
                source: 'serviceController',
                details: [{
                    name: 'service1',
                    projects: ['project1', 'project2']
                }]
            });

            sinon.assert.calledOnce(events.push);
            sinon.assert.calledWith(events.push, {
                eventName: 'stateUpdated',
                source: 'serviceView',
                details: [{
                    name: 'service1',
                    items: [{
                            id: 'project1',
                            name: 'project1',
                            group: null,
                            webUrl: null,
                            isBroken: false,
                            isRunning: false,
                            isDisabled: false,
                            tags: [],
                            changes: [],
                            error: null
                        },
                        {
                            id: 'project2',
                            name: 'project2',
                            group: null,
                            webUrl: null,
                            isBroken: false,
                            isRunning: false,
                            isDisabled: false,
                            tags: [],
                            changes: [],
                            error: null
                        }
                    ]
                }]
            });
        });

        it('should ignore disabled services on servicesInitializing', () => {
            servicesInitializingSubject.onNext({
                eventName: 'servicesInitializing',
                source: 'serviceController',
                details: [{
                    name: 'service1',
                    projects: ['project1', 'project2'],
                    disabled: true
                }]
            });

            sinon.assert.calledOnce(events.push);
            sinon.assert.calledWith(events.push, {
                eventName: 'stateUpdated',
                source: 'serviceView',
                details: []
            });
        });
    });
});
