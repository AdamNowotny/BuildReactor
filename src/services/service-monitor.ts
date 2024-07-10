import logger from 'common/logger';
import { sortBy } from 'common/utils';
import serviceConfig from 'service-worker/storage/service-config';
import serviceRepository from './service-repository';
import { CIBuild, CIServiceSettings } from './service-types';
import stateStorage from 'service-worker/storage/service-state';

const ALARM_NAME = 'update';

const init = async () => {
    logger.log('service-monitor.init');
    chrome.alarms.clearAll();
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name !== ALARM_NAME) return;
        logger.log('service-monitor.alarm', alarm);
        updateAll();
    });
};

const start = async () => {
    console.log('service-monitor.start');
    updateAll();
};

const updateAll = async () => {
    logger.log('service-monitor.updateAll');
    const allConfigs = await serviceConfig.get();
    const updatedServices = await Promise.all(
        allConfigs.map(async config => {
            const serviceState = await updateService(config);
            await stateStorage.updateService(config.name, serviceState);
            return serviceState;
        })
    );
    logger.warn('service-monitor.updateAll result', updatedServices);
    chrome.alarms.create(ALARM_NAME, { delayInMinutes: 0.5 });
};

const updateService = async (settings: CIServiceSettings) => {
    logger.log('service-monitor.updateService', settings.name, settings);
    const service = serviceRepository.getService(settings.baseUrl);
    return service
        .getLatest(settings)
        .toArray()
        .select(items => sortBy('id', items) as CIBuild[])
        .catch(ex => createFailedState(settings, ex))
        .toPromise();
};

export default {
    init,
    start,
};

function createFailedState(settings: CIServiceSettings, ex: Error): Rx.Observable<CIBuild[]> {
    logger.warn(`service-monitor.updateService.failed`, settings.name, settings);
    return Rx.Observable.fromArray(settings.projects)
        .select(
            project =>
                ({
                    id: project,
                    name: project,
                    group: null,
                    error: {
                        message: 'Service update failed',
                        description: ex.message,
                    },
                } as CIBuild)
        )
        .toArray();
}
