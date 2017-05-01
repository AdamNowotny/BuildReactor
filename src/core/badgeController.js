/* global chrome: false */
import events from 'core/events';

const colors = {
	grey: [200, 200, 200, 200],
	red: [255, 0, 0, 200],
	green: [0, 255, 0, 200]
};

function init() {
	let servicesStarted = false;
	let failedBuildsCount = 0;
	let offlineBuildsCount = 0;

	updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
	events.getByName('servicesInitializing').subscribe(() => {
		servicesStarted = false;
		failedBuildsCount = 0;
		offlineBuildsCount = 0;
		updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
	});
	events.getByName('servicesInitialized').subscribe(() => {
		servicesStarted = true;
		updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
	});
	events.getByName('buildFinished').subscribe((event) => {
		if (event.details && event.details.isDisabled) {
			return;
		}
		if (event.broken) {
			failedBuildsCount++;
		} else if (event.fixed) {
			failedBuildsCount = Math.max(failedBuildsCount - 1, 0);
		}
		updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
	});
	events.getByName('buildOffline').subscribe(() => {
		offlineBuildsCount++;
		updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
	});
	events.getByName('buildOnline').subscribe(() => {
		offlineBuildsCount--;
		updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
	});
}

function updateBadge(failedBuildsCount, initialized, offlineBuildsCount) {

	function setBadge(text, color) {
		chrome.browserAction.setBadgeText({ text });
		chrome.browserAction.setBadgeBackgroundColor({ color });
	}

	let color = colors.green;
	let text = '';
	if (!initialized || offlineBuildsCount) {
		color = colors.grey;
		text = failedBuildsCount ? failedBuildsCount.toString() : ' ';
	} else if (failedBuildsCount) {
		color = colors.red;
		text = failedBuildsCount.toString();
	}
	setBadge(text, color);
}

export default {
	init
};
