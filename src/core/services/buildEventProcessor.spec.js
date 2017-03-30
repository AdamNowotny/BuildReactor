import eventProcessor from 'core/services/buildEventProcessor';
import events from 'core/events';
import sinon from 'sinon';

describe('core/services/buildEventProcessor', () => {

    beforeEach(() => {
        sinon.stub(events, 'push');
        events.push.reset();
    });

    afterEach(() => {
        events.push.restore();
    });

    describe('serviceUpdated', () => {

        it('should push buildBroken', () => {
            const oldState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: false
                }]
            };
            const newState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: true
                }]
            };

            eventProcessor.process({ oldState, newState });

            sinon.assert.calledWith(events.push, {
                eventName: 'buildBroken',
                source: 'service1',
                details: {
                    id: 'abc',
                    isBroken: true
                }
            });
        });

        it('should push buildFixed', () => {
            const oldState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: true
                }]
            };
            const newState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: false
                }]
            };

            eventProcessor.process({ oldState, newState });

            sinon.assert.calledWith(events.push, {
                eventName: 'buildFixed',
                source: 'service1',
                details: {
                    id: 'abc',
                    isBroken: false
                }
            });
        });

        it('should push buildOffline', () => {
            const oldState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: null
                }]
            };
            const newState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: { message: 'error' }
                }]
            };

            eventProcessor.process({ oldState, newState });

            sinon.assert.calledWith(events.push, {
                eventName: 'buildOffline',
                source: 'service1',
                details: {
                    id: 'abc',
                    error: { message: 'error' }
                }
            });
        });

        it('should push buildOnline', () => {
            const oldState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: { message: 'error' }
                }]
            };
            const newState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: null
                }]
            };

            eventProcessor.process({ oldState, newState });

            sinon.assert.calledWith(events.push, {
                eventName: 'buildOnline',
                source: 'service1',
                details: {
                    id: 'abc',
                    error: null
                }
            });
        });

        it('should push passwordExpired', () => {
            const state = {
                eventName: 'serviceUpdated',
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: { name: 'UnauthorisedError' }
                }]
            };

            eventProcessor.process({ newState: state });

            sinon.assert.calledWith(events.push, {
                eventName: 'passwordExpired',
                source: 'service1',
                details: {
                    id: 'abc',
                    error: { name: 'UnauthorisedError' }
                }
            });
        });

        it('should push unique changes', () => {
            const oldState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: false
                }]
            };
            const newState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: true,
                    changes: [
                        {
                            name: 'name1',
                            message: 'message'
                        },
                        {
                            name: 'name1',
                            message: 'message'
                        }
                    ]
                }]
            };

            eventProcessor.process({ oldState, newState });

            sinon.assert.calledWith(events.push, {
                eventName: 'buildBroken',
                source: 'service1',
                details: {
                    id: 'abc',
                    isBroken: true,
                    changes: [
                        {
                            name: 'name1',
                            message: 'message'
                        }
                    ]
                }
            });
        });

    });

});
