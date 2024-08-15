import { ConfigStorageItem } from 'services/service-types';
import { Storage } from './storage';

const defaultConfiguration: ConfigStorageItem = {
    columns: 2,
    fullWidthGroups: true,
    singleGroupRows: false,
    showCommits: true,
    showCommitsWhenGreen: true,
    theme: 'dark',
    colorBlindMode: true,
    notifications: {
        enabled: true,
        buildBroken: true,
        buildFixed: true,
        buildStarted: true,
        buildSuccessful: true,
        buildStillFailing: true,
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
