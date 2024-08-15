import logger from 'common/logger';
import { Storage } from './storage';
import type { CIBuild, ServiceStateItem } from 'services/service-types';

const storage = new Storage<ServiceStateItem[]>({
    key: 'state',
    defaultValue: [],
});

const init = async () => {
    return storage.init();
};

const reset = async (serviceNames: string[]) => {
    logger.log('service-state.reset', serviceNames);
    const state = await storage.get();
    const newState = state.filter(item => serviceNames.includes(item.name));
    await storage.set(newState);
};

const updateService = async (serviceName: string, builds: CIBuild[]) => {
    logger.log('service-state.updateService', serviceName, builds);
    const serviceState: ServiceStateItem = {
        name: serviceName,
        failedCount: builds.filter(build => !build.isDisabled && build.isBroken).length,
        offlineCount: builds.filter(build => !build.isDisabled && build.error).length,
        runningCount: builds.filter(build => !build.isDisabled && build.isRunning).length,
        items: await createBuildState(serviceName, builds),
    };
    await setItem(serviceName, serviceState);
};

const createBuildState = async (
    serviceName: string,
    builds: CIBuild[],
): Promise<CIBuild[]> => {
    const oldState = await getItem(serviceName);
    return builds.map(build => {
        if (!build.error) return build;
        const oldBuild = oldState?.items?.find(old => old.id === build.id);
        if (!oldBuild) return build;
        return { ...oldBuild, error: build.error };
    });
};

const getItem = async (serviceName: string) => {
    const allItems = await storage.get();
    const item = allItems.find(state => state.name === serviceName);
    return item;
};

const setItem = async (serviceName: string, state: ServiceStateItem) => {
    const allItems = await storage.get();
    const found = allItems.find(state => state.name === serviceName);
    let updatedState: ServiceStateItem[];
    if (found) {
        updatedState = allItems.map(item => {
            return item.name === serviceName ? state : item;
        });
    } else {
        updatedState = [...allItems, state];
    }
    await storage.set(updatedState);
};

export default {
    init,
    onChanged: storage.onChanged,
    reset,
    set: storage.set,
    updateService,
};
