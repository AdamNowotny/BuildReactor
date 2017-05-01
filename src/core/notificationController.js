/* global chrome: false, Notification: false */
import 'rx/dist/rx.time';
import Rx from 'rx';
import chromeApi from 'common/chromeApi';
import events from 'core/events';
import serviceController from 'core/services/serviceController';
import tags from 'common/tags';

function init(options) {

    let config = {};
    options.configuration.subscribe((newConfig) => {
        config = newConfig;
    });

    function createPasswordExpiredMessage(event) {
        return {
            id: `${event.source}_disabled`,
            title: event.source,
            url: 'settings.html',
            icon: serviceController.typeInfoFor(event.source).icon,
            text: 'Password expired. Service has been disabled.'
        };
    }

    function createBuildFinishedMessage(event) {
        if (event.broken && config.notifications.buildBroken) {
            return createBuildBrokenMessage(event);
        } else if (event.fixed && config.notifications.buildFixed) {
            return createNotificationInfo(event, 'fixed', options.timeout);
        } else if (config.notifications.buildFinished) {
            return createNotificationInfo(event, 'finished', options.timeout);
        }
        return null;
    }

    function createBuildBrokenMessage(event) {
        if (tags.contains('Unstable', event.details.tags)) {
            return createNotificationInfo(event, 'unstable', options.timeout);
        } else {
            return createNotificationInfo(event, 'broken');
        }
    }

    function whenDashboardInactive(event) {
        return config.notifications.showWhenDashboardActive ?
            Rx.Observable.return(event) :
            chromeApi
                .isDashboardActive()
                .where((active) => !active)
                .select(() => event);
    }

    function createNotificationInfo(event, message, timeout) {

        function createId(eventDetails) {
            return eventDetails.group ?
                `${event.source}_${eventDetails.group}_${eventDetails.name}` :
                `${event.source}_${eventDetails.name}`;
        }

        function createTitle(eventDetails) {
            const fullBuildName = eventDetails.group ?
                `${eventDetails.group} / ${eventDetails.name} (${event.source})` :
                `${eventDetails.name} (${event.source})`;
            return `${fullBuildName} ${message}`;
        }

        function createChangesMessage(changes = []) {
            return changes.reduce((agg, change, i) => {
                if (i === 2) {
                    return `${agg}\n...`;
                }
                if (i > 2) {
                    return agg;
                }
                const changeMessage = change.message ?
                    `${change.name}: ${change.message}` :
                    change.name;
                return agg ? `${agg}\n${changeMessage}` : changeMessage;
            }, '');
        }

        const info = {
            id: createId(event.details),
            title: createTitle(event.details),
            url: event.details.webUrl,
            icon: serviceController.typeInfoFor(event.source).icon,
            timeout: timeout ? timeout : undefined,
            text: createChangesMessage(event.details.changes)
        };
        return info;
    }

    function showNotification(info) {
        if (!info) return;
        if (visibleNotifications[info.id]) {
            visibleNotifications[info.id].dispose();
        }
        visibleNotifications[info.id] = createNotification(info).subscribe(() => {}, () => {}, () => {
            delete visibleNotifications[info.id];
        });
    }

    function createNotification(info) {
        return Rx.Observable.create((observer) => {
            const notification = new Notification(info.title, {
                icon: info.icon,
                body: info.text,
                tag: info.id
            });
            notification.onclick = function() {
                chrome.tabs.create({ 'url': info.url }, (tab) => {
                    notification.close();
                });
            };
            notification.onclose = function() {
                observer.onCompleted();
            };
            if (info.timeout) {
                notification.onshow = function() {
                    Rx.Observable.timer(info.timeout, scheduler).subscribe(() => {
                        notification.close();
                    });
                };
            }
            return function() {
                notification.close();
            };
        });
    }

    const scheduler = options.scheduler || Rx.Scheduler.timeout;
    const visibleNotifications = {};
    let reloading = false;

    const buildStarted = events.getByName('buildStarted')
        .where((event) => config.notifications.enabled)
        .where((event) => config.notifications.buildStarted)
        .where((event) => !reloading)
        .where((event) => !event.details.isDisabled)
        .selectMany(whenDashboardInactive)
        .select((ev) => createNotificationInfo(ev, 'started', options.timeout));
    const buildFinished = events.getByName('buildFinished')
        .where((event) => config.notifications.enabled)
        .where((event) => !reloading)
        .where((event) => !event.details.isDisabled)
        .selectMany(whenDashboardInactive)
        .select(createBuildFinishedMessage);
    const passwordExpired = events.getByName('passwordExpired')
        .select(createPasswordExpiredMessage);

    events.getByName('servicesInitializing').subscribe(() => {
        reloading = true;
    });
    events.getByName('servicesInitialized').subscribe(() => {
        reloading = false;
    });

    passwordExpired
        .merge(buildStarted)
        .merge(buildFinished)
        .subscribe((ev) => showNotification(ev));
}

export default {
    init
};
