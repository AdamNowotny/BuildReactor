import logger from 'common/logger';
import { Storage } from './storage';
import type { CIBuild } from 'services/service-types';

export interface StateStorageItem {
    failedCount: number;
    runningCount: number;
    offlineCount: number;
    name?: string;
    items?: CIBuild[];
}

let storage = new Storage<StateStorageItem[]>({
    key: 'state',
    defaultValue: [],
});

const init = async () => {
    return storage.init();
};

const updateService = async (serviceName: string, builds: CIBuild[]) => {
    logger.log('state-storage.updateService', serviceName, builds);
}

export default {
    onChanged: storage.onChanged,
    init,
    set: storage.set,
    updateService,
};
