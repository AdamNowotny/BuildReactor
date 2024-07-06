import 'rx/dist/rx.time';
import Rx from 'rx';
import events from 'core/events';
import messages from 'core/notifications/notificationMessages';

function init(options) {

    let config = {};
    options.configuration.subscribe(newConfig => {
        config = newConfig;
    });

    function showNotification(info) {
        if (!info) return;
        visibleNotifications[info.id] = info;
        createNotification(info);
    }

    chrome.notifications.onClicked.addListener(id => {
        const info = visibleNotifications[id];
        void chrome.tabs.create({ 'url': info.url });
    });

    chrome.notifications.onClosed.addListener((id, byUser) => {
        delete visibleNotifications[id];
    });

    function createNotification(info) {
        chrome.notifications.create(info.id, {
            "type": "basic",
            "iconUrl": chrome.extension.getURL(info.icon),
            "title": info.title,
            "message": info.text
        });
        if (!info.priority) {
            Rx.Observable.timer(options.timeout || 5000, scheduler).subscribe(() => {
                chrome.notifications.clear(info.id);
            });
        }
    }

    const scheduler = options.scheduler || Rx.Scheduler.timeout;
    const visibleNotifications = {};

    const eventNotificationEnabled = (event) => {
        return Rx.Observable.return(event)
            .where(event => config.notifications.enabled)
            .where(event => !event.details.isDisabled);
    };

    const buildStarted = events.getByName('buildStarted')
        .selectMany(eventNotificationEnabled)
        .select(ev => messages.createBuildStartedMessage(ev, config.notifications));
    const buildFinished = events.getByName('buildFinished')
        .selectMany(eventNotificationEnabled)
        .select(ev => messages.createBuildFinishedMessage(ev, config.notifications));
    const passwordExpired = events.getByName('passwordExpired')
        .select(messages.createPasswordExpiredMessage);

    passwordExpired
        .merge(buildStarted)
        .merge(buildFinished)
        .subscribe(showNotification);
}

export default {
    init
};
