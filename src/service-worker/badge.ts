/* eslint-disable @typescript-eslint/no-magic-numbers */
import logger from 'common/logger';
import stateStorage from './state-storage';

const init = () => {
    logger.log('badge.init');
    stateStorage.onChanged.subscribe(({ newValue }) => {
        logger.log('badge', newValue);
        const failedCount = newValue.reduce((acc, item) => acc + item.failedCount, 0);
        const runningCount = newValue.reduce((acc, item) => acc + item.runningCount, 0);
        const offlineCount = newValue.reduce((acc, item) => acc + item.offlineCount, 0);
        if (runningCount > 0) {
            const text = failedCount > 0 ? `${failedCount}` : ' ';
            setBadge(text, 'orange');
        } else if (offlineCount > 0) {
            const text = failedCount > 0 ? `${failedCount}` : ' ';
            setBadge(text, 'grey');
        } else if (failedCount > 0) {
            setBadge(`${failedCount}`, 'red');
        } else {
            const text = newValue.length === 0 ? '' : ' ';
            setBadge(text, 'green');
        }
    });
};

function setBadge(text: string, color: string) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const chromeAction = chrome.browserAction ?? chrome.action;
    void chromeAction.setBadgeText({ text });
    void chromeAction.setBadgeBackgroundColor({ color });
}

export default {
    init,
};
