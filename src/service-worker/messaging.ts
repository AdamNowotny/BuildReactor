import logger from 'common/logger';
import serviceMonitor from '../services/service-monitor';

function availableServices(sendResponse: any) {
    const response = serviceMonitor.getTypes();
    logger.log('messaging.availableServices', response);
    sendResponse(response);
}

const availableProjects = (sendResponse, settings) => {
    serviceMonitor.getPipelinesFor(settings).subscribe(
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
        default:
            break;
    }
    return false;
};

const init = () => {
    logger.log('messaging.init');
    chrome.runtime.onMessage.addListener(handleMessage);
};

export default { init };
