import logger from 'common/logger';
import notification from 'service-worker/notification';
import serviceConfig from 'service-worker/storage/service-config';
import serviceState from '../storage/service-state';

const init = () => {
    logger.log('password-expired.init');
    serviceState.onChanged.subscribe(({ newValue }) => {
        logger.log('password-expired.serviceState.onChanged', newValue);
        newValue.forEach(service => {
            const authErrorCount = (service.items || []).filter(
                item => item.error?.name === 'UnauthorisedError'
            ).length;
            if (authErrorCount > 0) {
                processService(service.name);
            }
        });
    });
};

function processService(serviceName: string) {
    logger.log('password-expired.processService', serviceName);
    notification.show({
        serviceName,
        id: `${serviceName}_disabled`,
        title: serviceName,
        url: 'settings.html',
        message: 'Password expired. Service has been disabled.',
        requireInteraction: true,
    });
    serviceConfig.disableService(serviceName);
}

export default {
    init,
};
