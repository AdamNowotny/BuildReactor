import { ViewConfig } from 'common/types';
import { Storage } from './storage';

const defaultConfiguration: ViewConfig = {
    columns: 2,
    fullWidthGroups: true,
    singleGroupRows: false,
    showCommits: true,
    showCommitsWhenGreen: true,
    theme: 'dark',
    notifications: {
        enabled: true,
        buildBroken: true,
        buildFixed: true,
        buildStarted: true,
        buildSuccessful: true,
        buildStillFailing: true,
    },
};

const storage = new Storage<ViewConfig>({
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
