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
            sinon.assert.calledWith(events.push, sinon.match({
                eventName: 'stateUpdated',
                source: 'serviceView',
                details: [{
                    name: 'service1',
                    failedCount: 0,
                    offlineCount: 0,
                    runningCount: 0,
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
            }));
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
                    sinon.match({ name: 'service 2' }),
                    sinon.match({ name: 'service 1' })
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
                details: [
                    sinon.match({
                        name: 'service1',
                        items: [
                            sinon.match({ id: "a" }),
                            sinon.match({ id: "c" }),
                            sinon.match({ id: "b" })
                        ]
                    })
                ]
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
                oldState: sinon.match({
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
                }),
                newState: sinon.match({
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
                })
            });
        });
    });

    it('should clear error if update successful', () => {
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
            details: [sinon.match({
                name: 'service1',
                items: [
                    sinon.match({
                        id: 'abc',
                        error: null
                    })
                ]
            })]
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
            details: [
                sinon.match({
                    name: 'service1',
                    items: [
                        sinon.match({
                            id: 'abc',
                            error: {
                                message: 'Service update failed',
                                description: 'some error'
                            }
                        })
                    ]
                })
            ]
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
                details: [
                    sinon.match({
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
                    })
                ]
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

    it('should count failed builds for each service', () => {
        servicesInitializingSubject.onNext({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: [
                {
                    name: 'service1',
                    projects: ['abc', 'def']
                },
                {
                    name: 'service2',
                    projects: ['xyz']
                }
            ]
        });

        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service1',
            details: [{
                id: 'abc',
                isBroken: true
            }, {
                id: 'def',
                isBroken: true
            }]
        });
        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service2',
            details: [{
                id: 'xyz',
                isBroken: true
            }]
        });

        sinon.assert.calledWith(events.push, sinon.match({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [
                sinon.match({
                    name: 'service1',
                    failedCount: 2
                }),
                sinon.match({
                    name: 'service2',
                    failedCount: 1
                })
            ]
        }));
    });

    it('should not count disabled builds as failed', () => {
        servicesInitializingSubject.onNext({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: [
                {
                    name: 'service',
                    projects: ['abc', 'def']
                }
            ]
        });

        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service',
            details: [{
                id: 'abc',
                isBroken: true
            }, {
                id: 'def',
                isBroken: true,
                isDisabled: true
            }]
        });

        sinon.assert.calledWith(events.push, sinon.match({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [
                sinon.match({
                    name: 'service',
                    failedCount: 1
                })
            ]
        }));
    });

    it('should count offline builds for each service', () => {
        servicesInitializingSubject.onNext({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: [
                {
                    name: 'service1',
                    projects: ['abc', 'def']
                },
                {
                    name: 'service2',
                    projects: ['xyz']
                }
            ]
        });

        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service1',
            details: [{
                id: 'abc',
                error: {}
            }, {
                id: 'def',
                error: {}
            }]
        });
        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service2',
            details: [{
                id: 'xyz',
                error: {}
            }]
        });

        sinon.assert.calledWith(events.push, sinon.match({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [
                sinon.match({
                    name: 'service1',
                    offlineCount: 2
                }),
                sinon.match({
                    name: 'service2',
                    offlineCount: 1
                })
            ]
        }));
    });

    it('should not count disabled builds as offline', () => {
        servicesInitializingSubject.onNext({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: [
                {
                    name: 'service',
                    projects: ['abc', 'def']
                }
            ]
        });

        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service',
            details: [{
                id: 'abc',
                error: {}
            }, {
                id: 'def',
                error: {},
                isDisabled: true
            }]
        });

        sinon.assert.calledWith(events.push, sinon.match({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [
                sinon.match({
                    name: 'service',
                    offlineCount: 1
                })
            ]
        }));
    });

    it('should count running builds for each service', () => {
        servicesInitializingSubject.onNext({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: [
                {
                    name: 'service1',
                    projects: ['abc', 'def']
                },
                {
                    name: 'service2',
                    projects: ['xyz']
                }
            ]
        });

        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service1',
            details: [{
                id: 'abc',
                isRunning: true
            }, {
                id: 'def',
                isRunning: true
            }]
        });
        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service2',
            details: [{
                id: 'xyz',
                isRunning: true
            }]
        });

        sinon.assert.calledWith(events.push, sinon.match({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [
                sinon.match({
                    name: 'service1',
                    runningCount: 2
                }),
                sinon.match({
                    name: 'service2',
                    runningCount: 1
                })
            ]
        }));
    });

    it('should not count disabled builds as running', () => {
        servicesInitializingSubject.onNext({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: [
                {
                    name: 'service',
                    projects: ['abc', 'def']
                }
            ]
        });

        serviceUpdatedSubject.onNext({
            eventName: 'serviceUpdated',
            source: 'service',
            details: [{
                id: 'abc',
                isRunning: true
            }, {
                id: 'def',
                isRunning: true,
                isDisabled: true
            }]
        });

        sinon.assert.calledWith(events.push, sinon.match({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [
                sinon.match({
                    name: 'service',
                    runningCount: 1
                })
            ]
        }));
    });

});
