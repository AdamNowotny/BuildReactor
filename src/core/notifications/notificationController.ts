import 'rx/dist/rx.time';
import Rx from 'rx';
import events from 'core/events';
import messages, { NotificationMessage } from 'core/notifications/notificationMessages';
import viewConfigStorage from 'service-worker/storage/view-config';

function init() {

    let config: Record<string, any> = {};
    viewConfigStorage.onChanged.subscribe(newConfig => {
        config = newConfig.newValue;
    });

    const visibleNotifications = {};

    async function showNotification(info: NotificationMessage | null) {
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

    function createNotification(info: NotificationMessage) {
        chrome.notifications.create(info.id, {
            type: "basic",
            iconUrl: chrome.runtime.getURL(info.icon),
            title: info.title,
            message: info.text,
            requireInteraction: info.priority
        });
    }

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

    passwordExpired.subscribe((async (info) => showNotification(await info)));
    buildStarted.subscribe((async (info) => showNotification(await info)));
    buildFinished.subscribe((async (info) => showNotification(await info)));
}

export default {
    init
};
