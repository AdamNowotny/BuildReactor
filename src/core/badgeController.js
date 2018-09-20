/* global chrome: false */
import events from 'core/events';

const colors = {
    grey: [200, 200, 200, 200],
    red: [255, 0, 0, 200],
    green: [0, 255, 0, 200],
    yellow: [255, 150, 0, 200]
};

function init() {
    let servicesStarted = false;
    let failedBuildsCount = 0;
    let offlineBuildsCount = 0;
    let runningBuildsCount = 0;

    updateBadge(servicesStarted, failedBuildsCount, offlineBuildsCount, runningBuildsCount);
    events.getByName('servicesInitializing').subscribe(() => {
        servicesStarted = false;
        failedBuildsCount = 0;
        offlineBuildsCount = 0;
        runningBuildsCount = 0;
        updateBadge(servicesStarted, failedBuildsCount, offlineBuildsCount, runningBuildsCount);
    });
    events.getByName('servicesInitialized').subscribe(() => {
        servicesStarted = true;
        updateBadge(servicesStarted, failedBuildsCount, offlineBuildsCount, runningBuildsCount);
    });
    events.getByName('stateUpdated').subscribe((state) => {
        failedBuildsCount = state.details.reduce((a, b) => a.failedCount + b.failedCount, { failedCount: 0 }) || 0;
        offlineBuildsCount = state.details.reduce((a, b) => a.offlineCount + b.offlineCount, { offlineCount: 0 }) || 0;
        runningBuildsCount = state.details.reduce((a, b) => a.runningCount + b.runningCount, { runningCount: 0 }) || 0;
        updateBadge(servicesStarted, failedBuildsCount, offlineBuildsCount, runningBuildsCount);
    });
}

function updateBadge(initialized, failedBuildsCount, offlineBuildsCount, runningBuildsCount) {

    function setBadge(text, color) {
        chrome.browserAction.setBadgeText({ text });
        chrome.browserAction.setBadgeBackgroundColor({ color });
    }

    let color = colors.green;
    let text = '';
    if (!initialized || offlineBuildsCount) {
        color = colors.grey;
    } else if (runningBuildsCount) {
        color = colors.yellow;
    } else if (failedBuildsCount) {
        color = colors.red;
    }
    if (color !== colors.green) {
        text = failedBuildsCount ? failedBuildsCount.toString() : ' ';
    }
    setBadge(text, color);
}

export default {
    init
};
