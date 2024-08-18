import logger from 'common/logger';
import { CIBuild, ServiceStateItem } from 'common/types';
import notification from 'service-worker/notification';
import viewConfig from 'service-worker/storage/view-config';
import serviceState from '../storage/service-state';

const init = () => {
    logger.info('build-started.init');
    serviceState.onChanged.subscribe(stateChangeHandler);
};

export const stateChangeHandler = async ({ oldValue, newValue }) => {
    logger.log('build-started.serviceState.onChanged', oldValue, newValue);
    if (!(await notificationsEnabled())) return;
    newValue.map(newState => {
        const oldState = oldValue.find(state => state.name === newState.name);
        processService(oldState, newState);
    });
};

const notificationsEnabled = async () => {
    const config = await viewConfig.get();
    return config.notifications?.buildStarted;
};

const processService = (
    oldState: ServiceStateItem | undefined,
    newState: ServiceStateItem,
) => {
    logger.log('build-started.processService', oldState, newState);
    if (!oldState) return;
    newState.items?.forEach(item => {
        const oldBuild = oldState.items?.find(oldItem => oldItem.id === item.id);
        if (!oldBuild) return;
        processBuild(oldBuild, item, newState);
    });
};

const processBuild = (oldBuild: CIBuild, item: CIBuild, newState: ServiceStateItem) => {
    if (!oldBuild.isRunning && item.isRunning) {
        void notification.showBuild(newState.name, item, 'Build started');
    }
};

export default {
    init,
};
