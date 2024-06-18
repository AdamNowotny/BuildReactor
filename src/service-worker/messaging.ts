/* global chrome: false */

import logger from "./logger";
import serviceRepository from "./service-repository";

const handleMessage = (request, sender, sendResponse) => {
    logger.log('messaging.handleMessage', request);
    switch (request.name) {
        case 'availableServices':
            logger.log('messaging.availableServices');
            sendResponse(serviceRepository.getSettings());
            break;
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
