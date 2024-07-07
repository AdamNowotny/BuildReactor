import logger from 'common/logger';
import Rx from 'rx';
import type { CIBuild } from 'services/service-types';

interface StateStorageItem {
    failedCount: number;
    runningCount: number;
    offlineCount: number;
    name?: string;
    items?: CIBuild[];
}

interface StateStorageChangeEvent {
    oldValue: StateStorageItem[];
    newValue: StateStorageItem[];
}

const STORAGE_KEY = 'state';
const BUFFER_SIZE = 1;
const onChanged = new Rx.ReplaySubject<StateStorageChangeEvent>(BUFFER_SIZE);

const init = async () => {
    logger.log('state-storage.init');
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === STORAGE_KEY) {
                logger.log('state-storage.onChanged', changes, namespace);
                onChanged.onNext({ oldValue, newValue });
            }
        }
    });
    const result = await get();
    onChanged.onNext({ oldValue: result, newValue: result });   
    return result; 
};

const set = async (value: object) => {
    logger.log('state-storage.set', value);
    await chrome.storage.local.set({ state: value });
};

const get = async () => {
    return new Promise<StateStorageItem[]>(resolve => {
        chrome.storage.local.get(STORAGE_KEY, value => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            const result = value[STORAGE_KEY] || [];
            logger.log(`state-storage.get`, result);
            resolve(result);
        });
    });
};

export default {
    onChanged,
    init,
    set,
};
