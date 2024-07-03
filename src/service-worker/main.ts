import logger from 'common/logger';
import serviceRepository from '../services/service-repository';
import messaging from './messaging';
import stateStorage from './state-storage';

logger.init({ prefix: 'service-worker', enableEvents: false });
messaging.init();
serviceRepository.init();
stateStorage.init();
