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
        servicesInitializingSubject.onNext({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: [{
                name: 'service1',
                projects: ['abc']
            }]
        });
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
                    id: 'abc',
                    group: 'group'
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
                        name: "abc",
                        changes: [],
                        error: null,
                        group: 'group',
                        isBroken: false,
                        isDisabled: false,
                        isRunning: false,
                        tags: [],
                        webUrl: null
                    }]
                }]
            });
        });

        it('should keep sort order for services on serviceUpdated', () => {
            servicesInitializingSubject.onNext({
                eventName: 'servicesInitializing',
                source: 'serviceController',
                details: [
                    {
                        name: 'service 2',
                        projects: []
                    },
                    {
                        name: 'service 1',
                        projects: []
                    }
                ]
            });

            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service 1',
                details: []
            });
            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service 2',
                details: []
            });

            sinon.assert.calledThrice(events.push);
            sinon.assert.calledWith(events.push, {
                eventName: 'stateUpdated',
                source: 'serviceView',
                details: [
                    {
                        name: 'service 2',
                        items: []
                    },
                    {
                        name: 'service 1',
                        items: []
                    }
                ]
            });
        });

        it('should keep sort order for builds on serviceUpdated', () => {
            servicesInitializingSubject.onNext({
                eventName: 'servicesInitializing',
                source: 'serviceController',
                details: [
                    {
                        name: 'service1',
                        projects: ['a', 'c', 'b']
                    }
                ]
            });
            serviceUpdatedSubject.onNext({
                eventName: 'serviceUpdated',
                source: 'service1',
                details: [
                    { id: 'c' },
                    { id: 'a' },
                    { id: 'b' }
                ]
            });

            sinon.assert.calledTwice(events.push);
            sinon.assert.calledWith(events.push, {
                eventName: 'stateUpdated',
                source: 'serviceView',
                details: [{
                    name: 'service1',
                    items: [
                        {
                            id: "a",
                            name: "a",
                            changes: [],
                            error: null,
                            group: null,
                            isBroken: false,
                            isDisabled: false,
                            isRunning: false,
                            tags: [],
                            webUrl: null
                        },
                        {
                            id: "c",
                            name: "c",
                            changes: [],
                            error: null,
                            group: null,
                            isBroken: false,
                            isDisabled: false,
                            isRunning: false,
                            tags: [],
                            webUrl: null
                        },
                        {
                            id: "b",
                            name: "b",
                            changes: [],
                            error: null,
                            group: null,
                            isBroken: false,
                            isDisabled: false,
                            isRunning: false,
                            tags: [],
                            webUrl: null
                        }
                    ]
                }]
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
                        name: "abc",
                        isBroken: true,
                        error: null,
                        changes: [],
                        group: null,
                        isDisabled: false,
                        isRunning: false,
                        tags: [],
                        webUrl: null
                    }]
                },
                newState: {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        name: "abc",
                        error: { message: 'error' },
                        isBroken: true,
                        changes: [],
                        group: null,
                        isDisabled: false,
                        isRunning: false,
                        tags: [],
                        webUrl: null
                    }]
                }
            });
        });
    });

    it('should clear error on if update successful', () => {
        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service1',
            details: [{
                id: 'abc',
                error: { message: 'some error' }
            }]
        });
        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service1',
            details: [{
                id: 'abc'
            }]
        });

        sinon.assert.calledWith(events.push, {
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [{
                name: 'service1',
                items: [{
                    id: 'abc',
                    name: "abc",
                    error: null,
                    changes: [],
                    group: null,
                    isBroken: false,
                    isDisabled: false,
                    isRunning: false,
                    tags: [],
                    webUrl: null
                }]
            }]
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
                    name: "abc",
                    error: {
                        message: 'Service update failed',
                        description: 'some error'
                    },
                    changes: [],
                    group: null,
                    isBroken: false,
                    isDisabled: false,
                    isRunning: false,
                    tags: [],
                    webUrl: null
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
