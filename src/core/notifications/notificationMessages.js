import 'rx/dist/rx.time';
import serviceController from 'core/services/serviceController';

var containsTag = function(tagName, tags) {
    return tags?.reduce(function(agg, value) {
        return (Boolean(agg)) || value.name === tagName;
    }, false);
};

function createPasswordExpiredMessage(event) {
    return {
        id: `${event.source}_disabled`,
        title: event.source,
        url: 'settings.html',
        icon: serviceController.typeInfoFor(event.source).icon,
        text: 'Password expired. Service has been disabled.',
        priority: true
    };
}

function createBuildStartedMessage(ev, notificationsConfig) {
  return (notificationsConfig.buildStarted) ?
    createNotificationInfo(ev, 'Build started', false) :
    null;
}

/* eslint complexity: off, max-statements: off */
function createBuildFinishedMessage(event, notificationsConfig) {
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

function createNotificationInfo(event, title, priority) {

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

    function createChangesMessage(changes = []) {
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
        icon: serviceController.typeInfoFor(event.source).icon,
        priority,
        text: createBuildName(event.details) +
            createChangesMessage(event.details.changes)
    };
    return info;
}

export default {
    createPasswordExpiredMessage,
    createBuildStartedMessage,
    createBuildFinishedMessage
};
