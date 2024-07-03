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

const onChanged = new Rx.BehaviorSubject<StateStorageChangeEvent>({
    oldValue: [],
    newValue: [],
});

const init = () => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        logger.log('state-storage.onChanged', changes, namespace);
        for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === 'state') {
                onChanged.onNext({ oldValue, newValue });
            }
        }
    });
};

const set = async (value: object) => {
    logger.log('state-storage.set', value);
    await chrome.storage.local.set({ state: value });
};

export default {
    onChanged,
    init,
    set,
};
