import logger from 'common/logger';
import serviceConfig from 'service-worker/storage/service-config';
import stateStorage from 'service-worker/storage/service-state';
import { StorageChangeEvent } from 'service-worker/storage/storage';
import type { CIServiceSettings } from 'common/types';
import serviceRepository from './service-repository';

const ALARM_NAME = 'update';

const init = () => {
    logger.info('service-monitor.init');
    chrome.alarms.onAlarm.addListener(alarmHandler);
    serviceConfig.onChanged.subscribe(configChangedHandler);
};

const alarmHandler = async (alarm: chrome.alarms.Alarm) => {
    if (alarm.name !== ALARM_NAME) return;
    await updateAll(await serviceConfig.get());
};

const configChangedHandler = async (value: StorageChangeEvent<CIServiceSettings[]>) => {
    logger.log('service-monitor.onChanged', value);
    const serviceNames = value.newValue
        .filter(config => !config.isDisabled)
        .map(config => config.name);
    await stateStorage.reset(serviceNames);
    await updateAll(value.newValue);
};

const updateAll = async (allConfigs: CIServiceSettings[]) => {
    await chrome.alarms.clearAll();
    if (allConfigs.length === 0) return;
    logger.group('service-monitor.updateAll');
    const updatedServices = await Promise.all(
        allConfigs
            .filter(config => !config.isDisabled)
            .map(async config => {
                const serviceState = await serviceRepository.getLatestBuilds(config);
                await stateStorage.updateService(config.name, serviceState);
                return serviceState;
            }),
    );
    logger.log('service-monitor.updateAll result', updatedServices);
    await chrome.alarms.create(ALARM_NAME, { delayInMinutes: 0.5 });
    logger.groupEnd('service-monitor.updateAll');
};

export default {
    init,
};
