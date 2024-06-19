/* global chrome: false */

import logger from "./logger";
import serviceRepository from "./service-repository";

const availableProjects = (sendResponse, settings) => {
	serviceRepository.getPipelinesFor(settings)
		.subscribe((projects) => {
            console.log('messaging.availableProjects.subscribe', projects);
			projects.selected = settings.projects;
			sendResponse({ projects });
		}, (error) => {
            console.log('messaging.availableProjects.error', error);
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
            sendResponse(serviceRepository.getSettings());
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
