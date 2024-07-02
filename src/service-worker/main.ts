import logger from "common/logger";
import serviceRepository from '../services/service-repository';
import messaging from './messaging';

logger.init({ prefix: 'service-worker', enableEvents: false });
messaging.init();
serviceRepository.init();
