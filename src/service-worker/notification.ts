import serviceConfig from './storage/service-config';
import viewConfig from './storage/view-config';

export interface NotificationInfo {
    serviceName: string;
    id: string;
    title: string;
    message: string;
    requireInteraction?: boolean;
    url?: string;
}

let visibleNotifications = {};

const onClickedHandler = (id: string): void => {
    const info = visibleNotifications[id];
    void chrome.tabs.create({ url: info.url });
};

const onClosedHandler = (id: string): void => {
    delete visibleNotifications[id];
};

const init = async () => {
    chrome.notifications.onClicked.addListener(onClickedHandler);
    chrome.notifications.onClosed.addListener(onClosedHandler);
};

const show = async (info: NotificationInfo) => {
    if (!(await viewConfig.get()).notifications?.enabled) return;
    const serviceType = (await serviceConfig.getItem(info.serviceName)).baseUrl;
    const icon = chrome.runtime.getURL(`services/${serviceType}/icon.png`);
    chrome.notifications.create(info.id, {
        type: 'basic',
        iconUrl: icon,
        title: info.title,
        message: info.message,
        requireInteraction: info.requireInteraction,
    });
    visibleNotifications[info.id] = info;
};

export default {
    init,
    show,
};
