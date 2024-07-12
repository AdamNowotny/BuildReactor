import { CIBuild } from 'services/service-types';
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
    chrome.notifications.create(info.id, {
        type: 'basic',
        iconUrl: await getIcon(info),
        title: info.title,
        message: info.message,
        requireInteraction: info.requireInteraction,
    });
    visibleNotifications[info.id] = info;
};

async function getIcon(info: NotificationInfo) {
    const serviceType = (await serviceConfig.getItem(info.serviceName)).baseUrl;
    const icon = chrome.runtime.getURL(`services/${serviceType}/icon.png`);
    return icon;
}

const showBuild = async (serviceName: string, build: CIBuild, text: string) => {
    const buildId = build.group
        ? `${serviceName}_${build.group}_${build.id}`
        : `${serviceName}_${build.id}`;
    await show({
        serviceName,
        id: buildId,
        title: `${text} (${serviceName})`,
        url: build.webUrl,
        message: createMessage(build),
    });
};

const createMessage = (build: CIBuild) => {
    const buildName = build.group ? `${build.group} / ${build.name}` : build.name;
    const uniqueNames: Record<string, boolean> = {};
    const uniqueChanges =
        build.changes?.filter(change => {
            if (uniqueNames[change.name]) return false;
            uniqueNames[change.name] = true;
            return true;
        }) || [];
    const changes = uniqueChanges.map((change, index) => {
        if (index === 2) return '...';
        if (index > 2) return '';
        return change.message ? `${change.name}: ${change.message}` : change.name;
    });
    const changesMessage = changes.length ? '\n' + changes?.join('\n') : '';
    return `${buildName}${changesMessage}`;
};

export default {
    init,
    show,
    showBuild,
};
