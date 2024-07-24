import { Storage } from './storage';


export interface ConfigStorageItem {
    columns?: number;
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

const storage = new Storage<ConfigStorageItem>({
    key: 'configuration',
    defaultValue: defaultConfiguration,
});

const init = async () => {
    return storage.init();
};

export default {
    onChanged: storage.onChanged,
    init,
    set: storage.set,
    get: storage.get,
};
