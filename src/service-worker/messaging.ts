import logger from 'common/logger';
import serviceRepository from '../services/service-repository';
import stateStorage from './state-storage';
import viewConfigStorage from './view-config-storage';

function availableServices(sendResponse: any) {
    const response = serviceRepository.getAllDefinitions();
    logger.log('messaging.availableServices', response);
    sendResponse(response);
}

const availableProjects = (sendResponse, settings) => {
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
        default:
            break;
    }
    return false;
};

const handleConnectState = port => {
    const stateSubscription = stateStorage.onChanged.subscribe(state => {
        logger.log('messaging.handleConnectState', state);
        port.postMessage(state.newValue);
    });
    port.onDisconnect.addListener(() => {
        logger.log('messaging.handleConnectState.onDisconnect');
        stateSubscription.dispose();
    });
};

const handleConnectConfiguration = port => {
    const configSubsription = viewConfigStorage.onChanged.subscribe((value) => {
        logger.log('messaging.handleConnectConfiguration', value.newValue);
        port.postMessage(value.newValue);
    });
    port.onDisconnect.addListener(() => {
        logger.log('messaging.handleConnectConfiguration.onDisconnect');
        configSubsription.dispose();
    });
};

const handleConnect = port => {
    switch (port.name) {
        case 'state':
            handleConnectState(port);
            break;
        case 'views':
            handleConnectConfiguration(port);
            break;
        default:
            break;
    }
};

const init = () => {
    logger.log('messaging.init');
    chrome.runtime.onMessage.addListener(handleMessage);
    chrome.runtime.onConnect.addListener(handleConnect);
};

export default { init };
