import logger from 'common/logger';
import serviceConfig from 'service-worker/storage/service-config';
import stateStorage from 'service-worker/storage/service-state';
import serviceRepository from './service-repository';
import type { CIBuild, CIServiceSettings } from './service-types';

const ALARM_NAME = 'update';

const init = () => {
    logger.log('service-monitor.init');
    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name !== ALARM_NAME) return;
        logger.log('service-monitor.alarm', alarm);
        void (async () => {
            await updateAll(await serviceConfig.get());
        })();
    });
    serviceConfig.onChanged.subscribe(value => {
        logger.log('service-monitor.onChanged', value);
        const serviceNames = value.newValue
            .filter(config => !config.disabled)
            .map(config => config.name);
        void (async () => {
            await stateStorage.reset(serviceNames);
            await updateAll(value.newValue);
        });
    });
};

const start = async () => {
    logger.log('service-monitor.start');
    void updateAll(await serviceConfig.get());
};

const updateAll = async (allConfigs: CIServiceSettings[]) => {
    logger.log('service-monitor.updateAll');
    await chrome.alarms.clearAll();
    const updatedServices = await Promise.all(
        allConfigs
            .filter(config => !config.disabled)
            .map(async config => {
                const serviceState = await updateService(config);
                await stateStorage.updateService(config.name, serviceState);
                return serviceState;
            })
    );
    logger.log('service-monitor.updateAll result', updatedServices);
    await chrome.alarms.create(ALARM_NAME, { delayInMinutes: 0.5 });
};

const updateService = async (settings: CIServiceSettings) => {
    logger.log('service-monitor.updateService', settings.name, settings);
    const service = serviceRepository.getService(settings.baseUrl);
    return service
        .getLatest(settings)
        .filter(build => settings.projects.includes(build.id))
        .toArray()
        .select(items => items.sort((a, b) => a.name.localeCompare(b.name)))
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
                        name: ex.name,
                        message: 'Service update failed',
                        description: ex.message,
                    },
                } as CIBuild)
        )
        .toArray();
}
