import logger from "common/logger";
import serviceRepository from "./service-repository";

const availableProjects = (sendResponse, settings) => {
	serviceRepository.getPipelinesFor(settings)
		.subscribe((projects) => {
            logger.log('messaging.availableProjects.subscribe', projects);
			projects.selected = settings.projects;
			sendResponse({ projects });
		}, (error) => {
            logger.error('messaging.availableProjects.error', error);
			sendResponse({
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack
				}
			});
		});
};

const handleMessage = async(request, sender, sendResponse) => {
    logger.log('messaging.handleMessage', request);
    switch (request.name) {
        case 'availableServices':
            availableServices(sendResponse);
            break;
        case 'availableProjects':
            logger.log('messaging.availableProjects');
            await availableProjects(sendResponse, request.serviceSettings);
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

function availableServices(sendResponse: any) {
    const response = serviceRepository.getSettings();
    logger.log('messaging.availableServices', response);
    sendResponse(response);
}

