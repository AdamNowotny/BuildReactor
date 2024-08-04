import logger from 'common/logger';
import stateStorage from './storage/service-state';

const init = () => {
    logger.info('badge.init');
    stateStorage.onChanged.subscribe(({ newValue }) => {
        logger.log('badge', newValue);
        const failedCount = newValue.reduce(
            (acc, item) => acc + (item.failedCount ?? 0),
            0,
        );
        const runningCount = newValue.reduce(
            (acc, item) => acc + (item.runningCount ?? 0),
            0,
        );
        const offlineCount = newValue.reduce(
            (acc, item) => acc + (item.offlineCount ?? 0),
            0,
        );
        if (runningCount > 0) {
            const text = failedCount > 0 ? `${failedCount}` : ' ';
            setBadge(text, 'orange');
        } else if (offlineCount > 0) {
            const text = failedCount > 0 ? `${failedCount}` : ' ';
            setBadge(text, 'gray');
        } else if (failedCount > 0) {
            setBadge(`${failedCount}`, 'red');
        } else {
            setBadge('', 'green');
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
