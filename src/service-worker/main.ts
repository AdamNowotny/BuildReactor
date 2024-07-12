import logger from 'common/logger';
import serviceMonitor from 'services/service-monitor';
import serviceRepository from '../services/service-repository';
import badge from './badge';
import buildFinishedHandler from './events/build-finished';
import buildStartedHandler from './events/build-started';
import passwordExpiredHandler from './events/password-expired';
import messaging from './messaging';
import serviceConfig from './storage/service-config';
import stateStorage from './storage/service-state';
import viewConfigStorage from './storage/view-config';

void (async () => {
    logger.init({ prefix: 'service-worker' });
    await serviceConfig.init();
    await viewConfigStorage.init();
    await stateStorage.init();
    serviceRepository.init();
    messaging.init();
    badge.init();
    serviceMonitor.init();

    // events
    passwordExpiredHandler.init();
    buildStartedHandler.init();
    buildFinishedHandler.init();

    serviceMonitor.start();
})();
