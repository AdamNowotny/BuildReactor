import logger from "common/logger";
import serviceMonitor from '../services/service-monitor';
import messaging from './messaging';

serviceMonitor.init();
logger.init({ prefix: 'service-worker', enableEvents: false });
messaging.init();
