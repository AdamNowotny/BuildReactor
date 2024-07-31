import logger from 'common/logger';
import { Storage } from './storage';
import { CIServiceSettings } from 'services/service-types';

const storage = new Storage<CIServiceSettings[]>({
    key: 'services',
    defaultValue: [],
});

const init = async () => {
    return storage.init();
};

const getItem = async (serviceName: string) => {
    const allItems = await storage.get();
    const item = allItems.find(config => config.name === serviceName);
    return item;
};

const setItem = async (serviceName: string, config: CIServiceSettings) => {
    logger.log('service-config.setItem', serviceName, config);
    const allItems = await storage.get();
    const updated = allItems.map(item => {
        return item.name === serviceName ? config : item;
    });
    await storage.set(updated);
};

const enableService = async (serviceName: string) => {
    logger.log('service-config.enableService', serviceName);
    const config = await getItem(serviceName);
    if (!config) {
        throw new Error(`Service ${serviceName} not found`);
    }
    config.isDisabled = false;
    await setItem(serviceName, config);
};

const disableService = async (serviceName: string) => {
    logger.log('service-config.disableService', serviceName);
    const config = await getItem(serviceName);
    if (!config) {
        throw new Error(`Service ${serviceName} not found`);
    }
    config.isDisabled = true;
    await setItem(serviceName, config);
};

const removeService = async (serviceName: string) => {
    logger.log('service-config.removeService', serviceName);
    const allItems = await storage.get();
    const updated = allItems.filter(item => item.name !== serviceName);
    await storage.set(updated);
};

const renameService = async (oldName: string, newName: string) => {
    logger.log('service-config.renameService', oldName, newName);
    const allItems = await storage.get();
    const updated = allItems.map(item => {
        return item.name === oldName ? { ...item, name: newName } : item;
    });
    await storage.set(updated);
};

const saveService = async (config: CIServiceSettings) => {
    logger.log('service-config.saveService', config);
    const oldItem = await getItem(config.name);
    if (oldItem) {
        return setItem(config.name, config);
    } else {
        return storage.set([...(await storage.get()), config]);
    }
};

const setOrder = async (serviceNames: string[]) => {
    logger.log('service-config.setOrder', serviceNames);
    const newItems = await Promise.all(
        serviceNames.map(async name => {
            const item = await getItem(name);
            if (!item) {
                throw new Error(`Service ${name} not found`);
            }
            return item;
        }),
    );
    await storage.set(newItems);
};

const setBuildOrder = async (serviceName: string, builds: string[]) => {
    logger.log('service-config.setBuildOrder', serviceName, builds);
    const item = await getItem(serviceName);
    if (!item) {
        throw new Error(`Service ${serviceName} not found`);
    }
    item.pipelines = builds;
    await setItem(item.name, item);
};

export default {
    disableService,
    enableService,
    get: storage.get,
    getItem,
    init,
    onChanged: storage.onChanged,
    removeService,
    renameService,
    saveService,
    set: storage.set,
    setBuildOrder,
    setOrder,
};
