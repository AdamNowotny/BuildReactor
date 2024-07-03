import logger from 'common/logger';
import Rx from 'rx';

const onChanged = new Rx.BehaviorSubject({ oldValue: [], newValue: [] });

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
