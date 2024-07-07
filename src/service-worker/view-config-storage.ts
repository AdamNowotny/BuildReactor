import logger from 'common/logger';
import Rx from 'rx';

interface ConfigStorageItem {
    columns: number;
    fullWidthGroups?: boolean;
    singleGroupRows?: boolean;
    showCommits?: boolean;
    showCommitsWhenGreen?: boolean;
    theme?: string;
    colorBlindMode?: boolean;
    notifications?: {
        enabled: boolean;
        buildBroken: boolean;
        buildFixed: boolean;
        buildStarted: boolean;
        buildSuccessful: boolean;
        buildStillFailing: boolean;
    };
}

const defaultConfiguration: ConfigStorageItem = {
    columns: 2,
    fullWidthGroups: true,
    singleGroupRows: false,
    showCommits: true,
    showCommitsWhenGreen: false,
    theme: 'dark',
    colorBlindMode: true,
    notifications: {
        enabled: true,
        buildBroken: true,
        buildFixed: true,
        buildStarted: false,
        buildSuccessful: false,
        buildStillFailing: false,
    },
};

interface StorageChangeEvent<T> {
    oldValue: T;
    newValue: T;
}

const STORAGE_KEY = 'configuration';
const BUFFER_SIZE = 1;
const onChanged = new Rx.ReplaySubject<StorageChangeEvent<ConfigStorageItem>>(BUFFER_SIZE);

const init = async () => {
    logger.log(`view-config-storage.init`);
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === STORAGE_KEY) {
                logger.log(`view-config-storage.onChanged`, changes, namespace);
                onChanged.onNext({ oldValue, newValue });
            }
        }
    });
    const result = await get();
    onChanged.onNext({ oldValue: result, newValue: result });
};

const set = async (value: ConfigStorageItem) => {
    logger.log(`view-config-storage.set`, value);
    await chrome.storage.local.set({ [STORAGE_KEY]: value });
};

const get = async (): Promise<ConfigStorageItem> => {
    return new Promise<ConfigStorageItem>(resolve => {
        chrome.storage.local.get(STORAGE_KEY, value => {
            const result: ConfigStorageItem = {
                ...defaultConfiguration,
                ...value[STORAGE_KEY],
            };
            logger.log(`view-config-storage.get`, value, result);
            resolve(result);
        });
    });
};

export default {
    onChanged,
    init,
    set,
    get,
};
