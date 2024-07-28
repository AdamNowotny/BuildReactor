import logger from 'common/logger';
import notification from 'service-worker/notification';
import serviceConfig from 'service-worker/storage/service-config';
import serviceState from '../storage/service-state';

const init = () => {
    logger.log('password-expired.init');
    serviceState.onChanged.subscribe(({ oldValue, newValue }) => {
        logger.log('password-expired.serviceState.onChanged', oldValue, newValue);
        newValue.forEach(service => {
            const authErrorCount = (service.items ?? []).filter(
                item => item.error?.name === 'UnauthorisedError',
            ).length;
            if (authErrorCount) {
                logger.warn('password-expired.processService', service.name, service);
                processService(service.name);
            }
        });
    });
};

function processService(serviceName: string) {
    void notification.show({
        serviceName,
        id: `${serviceName}_disabled`,
        title: serviceName,
        url: 'settings.html',
        message: 'Password expired. Service has been disabled.',
        requireInteraction: true,
    });
    void serviceConfig.disableService(serviceName);
}

export default {
    init,
};
