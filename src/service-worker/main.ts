import logger from 'common/logger';
import serviceRepository from '../services/service-repository';
import messaging from './messaging';
import stateStorage from './state-storage';
import viewConfigStorage from './view-config-storage';
import serviceConfig from './service-config';

void (async () => {
    logger.init({ prefix: 'service-worker', enableEvents: false });
    messaging.init();
    serviceRepository.init();
    await serviceConfig.init();
    await viewConfigStorage.init();
    await stateStorage.init();
})();
