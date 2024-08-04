import logger from 'common/logger';
import notification from 'service-worker/notification';
import viewConfig, { ConfigStorageItem } from 'service-worker/storage/view-config';
import { CIBuild } from 'services/service-types';
import serviceState, { ServiceStateItem } from '../storage/service-state';

const init = () => {
    logger.info('build-finished.init');
    serviceState.onChanged.subscribe(stateChangeHandler);
    viewConfig.onChanged.subscribe(configurationChangeHandler);
};

let config: ConfigStorageItem = {};
const configurationChangeHandler = ({ oldValue, newValue }) => {
    logger.log('build-finished.viewConfig.onChanged', oldValue, newValue);
    config = newValue;
};

export const stateChangeHandler = ({ oldValue, newValue }) => {
    logger.log('build-finished.serviceState.onChanged', oldValue, newValue);
    newValue.map(newState => {
        const oldState = oldValue.find(state => state.name === newState.name);
        processService(oldState, newState);
    });
};

const processService = (
    oldState: ServiceStateItem | undefined,
    newState: ServiceStateItem,
) => {
    logger.log('build-finished.processService', oldState, newState);
    if (!oldState) return;
    newState.items?.forEach(item => {
        const oldBuild = oldState.items?.find(oldItem => oldItem.id === item.id);
        if (!oldBuild) return;
        processBuild(newState.name, oldBuild, item);
    });
};

const processBuild = (serviceName: string, oldBuild: CIBuild, newBuild: CIBuild) => {
    if (!oldBuild.isRunning || newBuild.isRunning) return;
    if (!oldBuild.isBroken && newBuild.isBroken) {
        if (!config.notifications?.buildBroken) return;
        const isUnstable = newBuild.tags?.some(tag => tag.name === 'Unstable');
        const message = isUnstable ? 'Build unstable' : 'Build broken';
        void notification.showBuild(serviceName, newBuild, message);
        return;
    }
    if (oldBuild.isBroken && !newBuild.isBroken) {
        if (!config.notifications?.buildFixed) return;
        void notification.showBuild(serviceName, newBuild, 'Build fixed');
        return;
    }
    if (oldBuild.isBroken && newBuild.isBroken) {
        if (!config.notifications?.buildStillFailing) return;
        void notification.showBuild(serviceName, newBuild, 'Build still failing');
        return;
    }
    if (!newBuild.isRunning as boolean) {
        if (!config.notifications?.buildSuccessful) return;
        void notification.showBuild(serviceName, newBuild, 'Build finished');
        return;
    }
};

export default {
    init,
};
