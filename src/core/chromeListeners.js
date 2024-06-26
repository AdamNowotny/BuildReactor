import Rx from 'rx';
import logger from 'common/logger';
import serviceConfiguration from 'core/config/serviceConfiguration';
import viewConfiguration from 'core/config/viewConfiguration';
import events from './events';

const stateUpdated = new Rx.BehaviorSubject([]);

const onMessage = (request, sender, sendResponse) => {
    try {
        return onMessageHandler(request, sender, sendResponse);
    } catch (ex) {
        logger.error(ex);
    }
    return false;
};

function onMessageHandler(request, sender, sendResponse) {
    switch (request.name) {
        case 'setOrder':
            serviceConfiguration.setOrder(request.order);
            break;
        case 'setBuildOrder':
            serviceConfiguration.setBuildOrder(
                request.serviceName,
                request.order
            );
            break;
        case 'enableService':
            serviceConfiguration.enableService(request.serviceName);
            break;
        case 'disableService':
            serviceConfiguration.disableService(request.serviceName);
            break;
        case 'removeService':
            serviceConfiguration.removeService(request.serviceName);
            break;
        case 'renameService':
            serviceConfiguration.renameService(
                request.oldName,
                request.newName
            );
            break;
        case 'saveService':
            serviceConfiguration.saveService(request.settings);
            break;
        case 'saveConfig':
            serviceConfiguration.save(request.config);
            break;
        case 'setViews':
            viewConfiguration.save(request.views);
            break;
        default:
            break;
    }
    return false;
}

const onConnect = (port) => {
    switch (port.name) {
        case 'state':
            var stateSubscription = stateUpdated.subscribe((state) => {
                port.postMessage(state.details);
            });
            port.onDisconnect.addListener(() => {
                stateSubscription.dispose();
            });
            break;
        case 'configuration':
            var configSubscription = serviceConfiguration.changes.subscribe(
                function (config) {
                    port.postMessage(config);
                }
            );
            port.onDisconnect.addListener(function (port) {
                configSubscription.dispose();
            });
            break;
        case 'views':
            var viewSubscription = viewConfiguration.changes.subscribe(
                function (config) {
                    port.postMessage(config);
                }
            );
            port.onDisconnect.addListener(function (port) {
                viewSubscription.dispose();
            });
            break;
    }
};

export default {
    init() {
        chrome.runtime.onConnect.addListener(onConnect);
        chrome.runtime.onMessage.addListener(onMessage);
        events.getByName('stateUpdated').subscribe(stateUpdated);
    },
};
