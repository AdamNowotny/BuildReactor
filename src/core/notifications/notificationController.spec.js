/* global chrome: false */
import Rx from 'rx/dist/rx.testing';
import chromeApi from 'common/chromeApi';
import events from 'core/events';
import notificationController from 'core/notifications/notificationController';
import notificationMessages from 'core/notifications/notificationMessages';

/* eslint max-statements: off */
describe('notificationController', () => {

    let configChanges;
    let buildFinishedEvents, buildStartedEvents;
    let servicesInitializedEvents, servicesInitializingEvents;
    let passwordExpiredEvents;
    let scheduler;
    let onClickedListener, onClosedListener;
    const expectedNotification = {
        type: 'basic',
        title: 'title',
        iconUrl: 'src/services/test/icon.png',
        message: 'text'
    };
    const defaultNotificationConfig = {
        notifications: {
            enabled: true,
            buildStarted: true,
            buildBroken: true,
            buildFixed: true,
            buildSuccessful: true,
            buildStillFailing: true,
            showWhenDashboardActive: false
        }
    };

    beforeEach(() => {
        configChanges = new Rx.BehaviorSubject(defaultNotificationConfig);
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
        onClosedListener = jasmine.createSpy();
        spyOn(chrome.notifications.onClicked, 'addListener').and.callFake(listener => {
            onClickedListener = listener;
        });
        spyOn(chrome.notifications.onClosed, 'addListener').and.callFake(listener => {
            onClosedListener = listener;
        });
        spyOn(chrome.notifications, 'create').and.returnValue(jasmine.createSpy());
        spyOn(chrome.notifications, 'clear').and.returnValue(jasmine.createSpy());
        spyOn(chromeApi, 'isDashboardActive').and.returnValue(Rx.Observable.return(false));
        const mockMessage = {
            id: 'id',
            title: 'title',
            url: 'url',
            icon: 'src/services/test/icon.png',
            text: 'text'
        };
        spyOn(notificationMessages, 'createBuildStartedMessage').and.returnValue(mockMessage);
        spyOn(notificationMessages, 'createBuildFinishedMessage').and.returnValue(mockMessage);
        spyOn(notificationMessages, 'createPasswordExpiredMessage').and.returnValue(mockMessage);

        notificationController.init({
            timeout: 5000,
            scheduler,
            configuration: configChanges
        });
    });

    describe('build started', () => {

        const testEvent = {
            eventName: 'buildStarted',
            source: 'service',
            details: {
                name: 'build'
            }
        };

        it('should show message', () => {
            buildStartedEvents.onNext(testEvent);

            expect(notificationMessages.createBuildStartedMessage).toHaveBeenCalledWith(testEvent, jasmine.anything());
            expect(chrome.notifications.create).toHaveBeenCalledWith('id', expectedNotification);
        });

        it('should not show message when notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: false } });

            buildStartedEvents.onNext(testEvent);

            expect(chrome.notifications.create).not.toHaveBeenCalled();
        });

    });

    describe('build successful', () => {

        const testEvent = {
            eventName: 'buildFinished',
            source: 'service',
            details: {
                name: 'build',
                isBroken: false
            }
        };

        it('should show message', () => {
            buildFinishedEvents.onNext(testEvent);

            expect(notificationMessages.createBuildFinishedMessage).toHaveBeenCalledWith(testEvent, jasmine.anything());
            expect(chrome.notifications.create).toHaveBeenCalledWith('id', expectedNotification);
        });

        it('should not show message when notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: false } });

            buildFinishedEvents.onNext(testEvent);

            expect(chrome.notifications.create).not.toHaveBeenCalled();
        });

    });

    describe('build broken', () => {

        let testEvent;

        beforeEach(() => {
            testEvent = {
                eventName: 'buildFinished',
                source: 'service',
                details: {
                    name: 'build'
                },
                broken: true
            };
        });

        it('should show message when build fails', () => {
            buildFinishedEvents.onNext(testEvent);

            expect(chrome.notifications.create).toHaveBeenCalledWith('id', expectedNotification);
        });

        it('should not show message when notifications disabled', () => {
            configChanges.onNext({ notifications: { enabled: false } });

            buildFinishedEvents.onNext(testEvent);

            expect(chrome.notifications.create).not.toHaveBeenCalled();
        });

        it('should not show message when build fails but is disabled', () => {
            testEvent.broken = true;
            testEvent.details.isDisabled = true;

            buildFinishedEvents.onNext(testEvent);

            expect(chrome.notifications.create).not.toHaveBeenCalled();
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

            expect(chrome.notifications.create).toHaveBeenCalledWith('id', expectedNotification);
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

            expect(chrome.notifications.create).not.toHaveBeenCalled();
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

            expect(chrome.notifications.create).not.toHaveBeenCalled();
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

            expect(chrome.notifications.create).toHaveBeenCalledWith('id', expectedNotification);
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

        expect(chrome.notifications.create).toHaveBeenCalledWith('id', expectedNotification);
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

        expect(chrome.notifications.create).not.toHaveBeenCalled();
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

        expect(chrome.notifications.create.calls.count()).toBe(2);
    });

    it('should not show any notifications when dashboard active', () => {
        chromeApi.isDashboardActive.and.returnValue(Rx.Observable.return(true));
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });

        scheduler.advanceBy(5000);

        expect(chrome.notifications.create).not.toHaveBeenCalled();
    });

    it('should show notifications when dashboard ignored', () => {
        configChanges.onNext({
            notifications: {
                enabled: true,
                showWhenDashboardActive: true,
                buildSuccessful: true
            }
        });
        chromeApi.isDashboardActive.and.returnValue(Rx.Observable.return(true));
        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {}
        });

        scheduler.advanceBy(5000);

        expect(chrome.notifications.create).toHaveBeenCalled();
    });

    it('should show url when notification clicked', () => {
        spyOn(chrome.tabs, 'create');

        buildFinishedEvents.onNext({
            eventName: 'buildFinished',
            details: {},
            broken: true
        });
        onClickedListener('id');

        expect(chrome.tabs.create).toHaveBeenCalled();
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

        expect(chrome.notifications.clear).not.toHaveBeenCalled();
    });

});
