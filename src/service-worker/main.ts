import logger from "common/logger";
import serviceMonitor from '../services/service-monitor';
import messaging from './messaging';

logger.init({ prefix: 'service-worker', enableEvents: false });
messaging.init();
serviceMonitor.init();
