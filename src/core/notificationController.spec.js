/* global chrome: false */
import Rx from 'rx/dist/rx.testing';
import chromeApi from 'common/chromeApi';
import events from 'core/events';
import notificationController from 'core/notificationController';
import serviceController from 'core/services/serviceController';

describe('notificationController', () => {

    let configChanges;
    let buildFinishedEvents, buildStartedEvents;
    let servicesInitializedEvents, servicesInitializingEvents;
    let passwordExpiredEvents;
    let mockNotification;
    let scheduler;

    beforeEach(() => {
        configChanges = new Rx.BehaviorSubject({
            notifications: {
                enabled: true,
                buildStarted: true,
                buildBroken: true,
                buildFixed: true,
                buildFinished: true,
                showWhenDashboardActive: false
            }
        });
        buildStartedEvents = new Rx.Subject();
        buildFinishedEvents = new Rx.Subject();
        servicesInitializingEvents = new Rx.Subject();
        servicesInitializedEvents = new Rx.Subject();
        passwordExpiredEvents = new Rx.Subject();
        spyOn(events, 'getByName').and.callFake((name) => {
            switch (name) {
                case 'buildStarted':
                    return buildStartedEvents;
                case 'buildFinished':
                    return buildFinishedEvents;
                case 'servicesInitializing':
                    return servicesInitializingEvents;
                case 'servicesInitialized':
                    return servicesInitializedEvents;
                case 'passwordExpired':
                    return passwordExpiredEvents;
                default:
                    return null;
            }
        });
        scheduler = new Rx.TestScheduler();
        mockNotification = {
            close: jasmine.createSpy(),
            onshow: jasmine.createSpy(),
            onclick: jasmine.createSpy()
        };
        spyOn(window, 'Notification').and.returnValue(mockNotification);
        spyOn(chromeApi, 'isDashboardActive').and.returnValue(Rx.Observable.return(false));
        spyOn(serviceController, 'typeInfoFor').and
            .returnValue({ icon: 'src/core/services/test/icon.png' });
        notificationController.init({
            timeout: 5000,
            scheduler,
            configuration: configChanges
        });
    });

    describe('build started', () => {

        it('should show message', () => {
            buildStartedEvents.onNext({
                eventName: 'buildStarted',
                source: 'service',
                details: {
                    name: 'build'
                }
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) started', {
                    icon: 'src/core/services/test/icon.png',
                    body: '',
                    tag: 'service_build'
                }
            );
        });

        it('should show who started the build when changes available', () => {
            buildStartedEvents.onNext({
                eventName: 'buildStarted',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                }
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) started', {
                    icon: 'src/core/services/test/icon.png',
                    body: 'User 1\nUser 2',
                    tag: 'service_build'
                }
            );
        });

        it('should not show message when notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: false } });
            buildStartedEvents.onNext({
                eventName: 'buildStarted',
                source: 'service',
                details: {
                    name: 'build'
                }
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

        it('should not show message when buildStarted notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: true, buildStarted: false } });
            buildStartedEvents.onNext({
                eventName: 'buildStarted',
                source: 'service',
                details: {
                    name: 'build'
                }
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

    });

    describe('build finished', () => {

        it('should show message', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                }
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) finished', {
                    icon: 'src/core/services/test/icon.png',
                    body: '',
                    tag: 'service_build'
                }
            );
        });

        it('should show who started the build when changes available', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1',
                        message: 'message 1'
                    }, {
                        name: 'User 2',
                        message: 'message 2'
                    }]
                }
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) finished', {
                    icon: 'src/core/services/test/icon.png',
                    body: 'User 1: message 1\nUser 2: message 2',
                    tag: 'service_build'
                }
            );
        });

        it('should not show message when notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: false } });
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                }
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

        it('should not show message when buildFinished notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: true, buildFinished: false } });
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                }
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

    });

    describe('build broken', () => {

        it('should show message when build fails', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                },
                broken: true
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) broken', {
                    icon: 'src/core/services/test/icon.png',
                    body: '',
                    tag: 'service_build'
                }
            );
        });

        it('should not show message when notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: false } });
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                },
                broken: true
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

        it('should not show message when buildFinished notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: true, buildBroken: false } });
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                },
                broken: true
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

        it('should show who broke the build when changes available', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                },
                broken: true
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) broken', {
                    icon: 'src/core/services/test/icon.png',
                    body: 'User 1\nUser 2',
                    tag: 'service_build'
                }
            );
        });

        it('should show group name when available', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    group: 'group',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                },
                broken: true
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'group / build (service) broken', {
                    icon: 'src/core/services/test/icon.png',
                    body: 'User 1\nUser 2',
                    tag: 'service_group_build'
                }
            );
        });

        it('should show max 2 users who broke the build', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => ({
                        name: `User ${d}`,
                        message: `message ${d}`
                    }))
                },
                broken: true
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) broken', {
                    icon: 'src/core/services/test/icon.png',
                    body: 'User 1: message 1\nUser 2: message 2\n...',
                    tag: 'service_build'
                }
            );
        });

        it('should not show message when build fails but is disabled', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    isDisabled: true
                },
                broken: true
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

        it('should not close notifications about failed builds', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                details: {},
                broken: true
            });
            mockNotification.onshow();

            expect(mockNotification.close).not.toHaveBeenCalled();
        });

    });

    describe('build fixed', () => {

        it('should show message if build fixed', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                },
                fixed: true
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) fixed', {
                    icon: 'src/core/services/test/icon.png',
                    body: '',
                    tag: 'service_build'
                }
            );
        });

        it('should not show message when notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: false } });
            buildStartedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                },
                fixed: true
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

        it('should not show message when buildFixed notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: true, buildFixed: false } });
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                },
                fixed: true
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });


        it('should show who fixed the build when changes available', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    changes: [{
                        name: 'User 1'
                    }, {
                        name: 'User 2'
                    }]
                },
                fixed: true
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) fixed', {
                    icon: 'src/core/services/test/icon.png',
                    body: 'User 1\nUser 2',
                    tag: 'service_build'
                }
            );
        });

        it('should not show message if build fixed but is disabled', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    isDisabled: true
                },
                fixed: true
            });

            expect(window.Notification).not.toHaveBeenCalled();
        });

        // TODO: !(TestScheduler instanceof Scheduler) ?
        xit('should close notifications about fixed builds after 5 seconds', function() {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                details: {},
                fixed: true
            });

            scheduler.advanceBy(3000);
            mockNotification.onshow();

            scheduler.advanceBy(3000);
            expect(mockNotification.close).not.toHaveBeenCalled();
            scheduler.advanceBy(5000);
            expect(mockNotification.close).toHaveBeenCalled();
        });

    });

    describe('unstable', () => {

        it('should show message when unstable build fails', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build',
                    tags: [{
                        name: 'Unstable'
                    }]
                },
                broken: true
            });

            expect(window.Notification).toHaveBeenCalledWith(
                'build (service) unstable', {
                    icon: 'src/core/services/test/icon.png',
                    body: '',
                    tag: 'service_build'
                }
            );
        });

        // TODO: !(TestScheduler instanceof Scheduler) ?
        xit('should close notifications about unstable builds after 5 seconds', () => {
            buildFinishedEvents.onNext({
                eventName: 'buildFinished',
                details: {
                    tags: [{
                        name: 'Unstable'
                    }]
                },
                broken: true
            });

            mockNotification.onshow();

            scheduler.advanceBy(5000);

            expect(mockNotification.close).toHaveBeenCalled();
        });

    });

    it('should show message when password expired', () => {
        passwordExpiredEvents.onNext({
            eventName: 'passwordExpired',
            source: 'service',
            details: {
                name: 'build'
            }
        });

        expect(window.Notification).toHaveBeenCalledWith(
            'service', {
                icon: 'src/core/services/test/icon.png',
                body: 'Password expired. Service has been disabled.',
                tag: 'service_disabled'
            }
        );
    });

    it('should not show buildBroken notifications when initializing', () => {
        servicesInitializingEvents.onNext({
            eventName: 'servicesInitializing'
        });
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });

        scheduler.advanceBy(5000);

        expect(window.Notification).not.toHaveBeenCalled();
    });

    it('should show notifications after initialized', () => {
        servicesInitializingEvents.onNext({
            eventName: 'servicesInitializing'
        });
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            fixed: true
        });
        servicesInitializedEvents.onNext({
            eventName: 'servicesInitialized',
            details: {}
        });
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            fixed: true
        });

        scheduler.advanceBy(5000);

        expect(window.Notification.calls.count()).toBe(2);
    });

    it('should not show any notifications when dashboard active', () => {
        chromeApi.isDashboardActive.and.returnValue(Rx.Observable.return(true));
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });

        scheduler.advanceBy(5000);

        expect(window.Notification).not.toHaveBeenCalled();
    });

    it('should show notifications when dashboard ignored', () => {
        configChanges.onNext({
            notifications: {
                enabled: true,
                showWhenDashboardActive: true,
                buildFinished: true
            }
        });
        chromeApi.isDashboardActive.and.returnValue(Rx.Observable.return(true));
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {}
        });

        scheduler.advanceBy(5000);

        expect(window.Notification).toHaveBeenCalled();
    });

    it('should show url when notification clicked', () => {
        spyOn(chrome.tabs, 'create');

        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });
        mockNotification.onclick();

        expect(chrome.tabs.create).toHaveBeenCalled();
    });

    it('should hide notification when url shown', () => {
        spyOn(chrome.tabs, 'create').and.callFake((obj, callback) => {
            callback();
        });

        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });
        mockNotification.onclick();

        expect(mockNotification.close).toHaveBeenCalled();
    });

    it('should hide notifications about failed build if already fixed', () => {
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            source: '1',
            details: {},
            broken: true
        });
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            source: '1',
            details: {},
            fixed: true
        });

        expect(mockNotification.close).toHaveBeenCalled();
    });

    it('should not hide notifications about all failed builds if one fixed', () => {
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            source: 'service 1',
            details: {},
            broken: true
        });
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            source: 'service 2',
            details: {},
            fixed: true
        });

        expect(mockNotification.close).not.toHaveBeenCalled();
    });

});
