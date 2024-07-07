import logger from 'common/logger';
import serviceRepository from '../services/service-repository';
import messaging from './messaging';
import stateStorage from './state-storage';
import viewConfigStorage from './view-config-storage';

void (async () => {
    logger.init({ prefix: 'service-worker', enableEvents: false });
    messaging.init();
    serviceRepository.init();
    await stateStorage.init();
    await viewConfigStorage.init();
})();
