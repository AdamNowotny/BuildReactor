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

        describe('buildFinished', () => {

            it('should push buildFinished when broken', () => {
                const oldState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: false,
                        isRunning: true
                    }]
                };
                const newState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: true,
                        isRunning: false
                    }]
                };

                eventProcessor.process({
                    oldState,
                    newState
                });

                sinon.assert.calledWith(events.push, {
                    eventName: 'buildFinished',
                    source: 'service1',
                    details: {
                        id: 'abc',
                        isBroken: true,
                        isRunning: false
                    },
                    broken: true,
                    fixed: false
                });
            });

            it('should push buildFinished when fixed', () => {
                const oldState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: true,
                        isRunning: true
                    }]
                };
                const newState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: false,
                        isRunning: false
                    }]
                };

                eventProcessor.process({
                    oldState,
                    newState
                });

                sinon.assert.calledWith(events.push, {
                    eventName: 'buildFinished',
                    source: 'service1',
                    details: {
                        id: 'abc',
                        isBroken: false,
                        isRunning: false
                    },
                    broken: false,
                    fixed: true
                });
            });

            it('should push buildFinished when successful', () => {
                const oldState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: false,
                        isRunning: true
                    }]
                };
                const newState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: false,
                        isRunning: false
                    }]
                };

                eventProcessor.process({
                    oldState,
                    newState
                });

                sinon.assert.calledWith(events.push, {
                    eventName: 'buildFinished',
                    source: 'service1',
                    details: {
                        id: 'abc',
                        isBroken: false,
                        isRunning: false
                    },
                    broken: false,
                    fixed: false
                });
            });

            it('should push buildFinished when still failing', () => {
                const oldState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: true,
                        isRunning: true
                    }]
                };
                const newState = {
                    name: 'service1',
                    items: [{
                        id: 'abc',
                        isBroken: true,
                        isRunning: false
                    }]
                };

                eventProcessor.process({
                    oldState,
                    newState
                });

                sinon.assert.calledWith(events.push, {
                    eventName: 'buildFinished',
                    source: 'service1',
                    details: {
                        id: 'abc',
                        isBroken: true,
                        isRunning: false
                    },
                    broken: false,
                    fixed: false
                });
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
                    error: {
                        message: 'error'
                    }
                }]
            };

            eventProcessor.process({
                oldState,
                newState
            });

            sinon.assert.calledWith(events.push, {
                eventName: 'buildOffline',
                source: 'service1',
                details: {
                    id: 'abc',
                    error: {
                        message: 'error'
                    }
                }
            });
        });

        it('should push buildOnline', () => {
            const oldState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: {
                        message: 'error'
                    }
                }]
            };
            const newState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    error: null
                }]
            };

            eventProcessor.process({
                oldState,
                newState
            });

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
                    error: {
                        name: 'UnauthorisedError'
                    }
                }]
            };

            eventProcessor.process({
                newState: state
            });

            sinon.assert.calledWith(events.push, {
                eventName: 'passwordExpired',
                source: 'service1',
                details: {
                    id: 'abc',
                    error: {
                        name: 'UnauthorisedError'
                    }
                }
            });
        });

        it('should push unique changes', () => {
            const oldState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: false,
                    isRunning: true
                }]
            };
            const newState = {
                name: 'service1',
                items: [{
                    id: 'abc',
                    isBroken: true,
                    isRunning: false,
                    changes: [{
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

            eventProcessor.process({
                oldState,
                newState
            });

            sinon.assert.calledWith(events.push, {
                eventName: 'buildFinished',
                source: 'service1',
                details: {
                    id: 'abc',
                    isBroken: true,
                    isRunning: false,
                    changes: [{
                        name: 'name1',
                        message: 'message'
                    }]
                },
                broken: true,
                fixed: false
            });
        });

    });

});
