import logger from 'common/logger';
import serviceRepository from '../services/service-repository';
import stateStorage from './storage/service-state';
import viewConfigStorage from './storage/view-config';
import serviceConfig from './storage/service-config';
import { CIServiceSettings } from 'services/service-types';

function availableServices(sendResponse: any) {
    const response = serviceRepository.getAllDefinitions();
    logger.log('messaging.availableServices', response);
    sendResponse(response);
}

const availableProjects = (sendResponse, settings: CIServiceSettings) => {
    serviceRepository.getPipelinesFor(settings).subscribe(
        projects => {
            logger.log('messaging.availableProjects', projects);
            sendResponse({ projects });
        },
        error => {
            logger.error('messaging.availableProjects', error);
            sendResponse({
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
            });
        }
    );
};

const handleMessage = (request, sender, sendResponse) => {
    logger.log('messaging.handleMessage', request);
    switch (request.name) {
        case 'availableServices':
            availableServices(sendResponse);
            break;
        case 'availableProjects':
            availableProjects(sendResponse, request.serviceSettings);
            return true;
        case 'setViews':
            void viewConfigStorage.set(request.views);
            break;
        case 'disableService':
            void serviceConfig.disableService(request.serviceName);
            break;
        case 'enableService':
            void serviceConfig.enableService(request.serviceName);
            break;
        case 'setOrder':
            void serviceConfig.setOrder(request.order);
            break;
        case 'setBuildOrder':
            void serviceConfig.setBuildOrder(request.serviceName, request.order);
            break;
        case 'removeService':
            void serviceConfig.removeService(request.serviceName);
            break;
        case 'renameService':
            void serviceConfig.renameService(request.oldName, request.newName);
            break;
        case 'saveService':
            void serviceConfig.saveService(request.settings);
            break;
        case 'saveConfig':
            void serviceConfig.set(request.config);
            break;
        default:
            break;
    }
    return false;
};

const connectState = port => {
    const stateSubscription = stateStorage.onChanged.subscribe(state => {
        logger.log('messaging.connect.state', state);
        port.postMessage(state.newValue);
    });
    port.onDisconnect.addListener(() => {
        logger.log('messaging.connect.state.onDisconnect');
        stateSubscription.dispose();
    });
};

const connectViewConfig = port => {
    const configSubsription = viewConfigStorage.onChanged.subscribe(value => {
        logger.log('messaging.connect.view-config', value.newValue);
        port.postMessage(value.newValue);
    });
    port.onDisconnect.addListener(() => {
        logger.log('messaging.connect.view-config.onDisconnect');
        configSubsription.dispose();
    });
};

const connectServiceConfig = port => {
    const configSubsription = serviceConfig.onChanged.subscribe(value => {
        logger.log('messaging.connect.serviceConfig', value.newValue);
        port.postMessage(value.newValue);
    });
    port.onDisconnect.addListener(() => {
        logger.log('messaging.connect.serviceConfig.onDisconnect');
        configSubsription.dispose();
    });
};

const handleConnect = port => {
    switch (port.name) {
        case 'state':
            connectState(port);
            break;
        case 'views':
            connectViewConfig(port);
            break;
        case 'configuration':
            connectServiceConfig(port);
            break;
        default:
            break;
    }
};

const init = () => {
    logger.log('messaging.init');
    chrome.runtime.onConnect.addListener(handleConnect);
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
            return handleMessage(request, sender, sendResponse);
        } catch (ex) {
            logger.error(ex);
        }
        return false;
    });
};

export default { init };
