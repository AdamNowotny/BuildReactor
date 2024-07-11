import 'rx/dist/rx.time';
import serviceConfig from 'service-worker/storage/service-config';
import serviceRepository from 'services/service-repository';

var containsTag = function(tagName, tags) {
    return tags?.reduce(function(agg, value) {
        return (Boolean(agg)) || value.name === tagName;
    }, false);
};

const getIcon = async (serviceName) => {
    const settings = await serviceConfig.getItem(serviceName);
    const service = serviceRepository.getService(settings.baseUrl);
    return service.getInfo().icon;
}

export interface NotificationMessage {
    id: string;
    title: string;
    url: string;
    icon: string;
    text: string;
    priority?: boolean;
}

async function createBuildStartedMessage(ev, notificationsConfig): Promise<NotificationMessage | null> {
  return (notificationsConfig.buildStarted) ?
    createNotificationInfo(ev, 'Build started', false) :
    null;
}

async function createBuildFinishedMessage(event, notificationsConfig): Promise<NotificationMessage | null> {
    if (event.broken && notificationsConfig.buildBroken) {
        if (containsTag('Unstable', event.details.tags)) {
            return createNotificationInfo(event, 'Build unstable', false);
        } else {
            return createNotificationInfo(event, 'Build broken', true);
        }
    }
    if (event.fixed && notificationsConfig.buildFixed) {
        return createNotificationInfo(event, 'Build fixed', false);
    }
    if (!event.details.isBroken && notificationsConfig.buildSuccessful) {
        return createNotificationInfo(event, 'Build successful', false);
    }
    if (event.details.isBroken && notificationsConfig.buildStillFailing) {
        return createNotificationInfo(event, 'Build still failing', false);
    }
    return null;
}

async function createNotificationInfo(event, title, priority): Promise<NotificationMessage> {

    function createId(eventDetails) {
        return eventDetails.group ?
            `${event.source}_${eventDetails.group}_${eventDetails.name}` :
            `${event.source}_${eventDetails.name}`;
    }

    function createBuildName(eventDetails) {
        return eventDetails.group ?
            `${eventDetails.group} / ${eventDetails.name}` :
            `${eventDetails.name}`;
    }

    function createChangesMessage(changes: any[] = []) {
        if (changes.length === 0) return '';
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
        }, '\n');
    }

    const info = {
        id: createId(event.details),
        title: `${title} (${event.source})`,
        url: event.details.webUrl,
        icon: await getIcon(event.source),
        priority,
        text: createBuildName(event.details) +
            createChangesMessage(event.details.changes)
    };
    return info;
}

export default {
    createBuildStartedMessage,
    createBuildFinishedMessage
};
