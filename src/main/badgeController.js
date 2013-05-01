define([
	'main/serviceController'
], function (serviceController) {
	
	'use strict';

	var colors = {
		grey: [200, 200, 200, 200],
		red: [255, 0, 0, 200],
		green: [0, 255, 0, 200]
	};

	function badgeController() {

		function onBrokenBuild() {
			failedBuildsCount++;
			updateBadge(failedBuildsCount, servicesStarted);
		}

		function onFixedBuild() {
			failedBuildsCount--;
			updateBadge(failedBuildsCount, servicesStarted);
		}

		function onServicesStarted() {
			servicesStarted = true;
			updateBadge(failedBuildsCount, servicesStarted);
		}
		
		function onReset() {
			servicesStarted = false;
			failedBuildsCount = 0;
			updateBadge(failedBuildsCount, servicesStarted);
		}

		var servicesStarted = false;
		var failedBuildsCount = 0;
		var eventHandlers = {
			'servicesInitializing': onReset,
			'servicesInitialized': onServicesStarted,
			'buildBroken': onBrokenBuild,
			'buildFixed': onFixedBuild
		};
		updateBadge(failedBuildsCount, servicesStarted);
		return serviceController.events.doAction(function (event) {
			var handler = eventHandlers[event.eventName];
			if (handler) {
				handler(event);
			}
		}).subscribe();
	}

	function updateBadge(failedBuildsCount, initialized) {
	
		function showBuildFailedBadge() {
			var badgeInfo = {
				text: failedBuildsCount.toString(),
				color: colors.red
			};
			setBadge(badgeInfo);
		}

		function showBuildFixedBadge() {
			var badgeInfo = {
				text: '',
				color: colors.green
			};
			setBadge(badgeInfo);
		}

		function showStateUnknownBadge() {
			var badgeInfo = {
				text: ' ',
				color: colors.grey
			};
			setBadge(badgeInfo);
		}

		function setBadge(badgeInfo) {
			chrome.browserAction.setBadgeText({ text: badgeInfo.text });
			chrome.browserAction.setBadgeBackgroundColor({ color: badgeInfo.color });
		}

		if (failedBuildsCount !== 0) {
			showBuildFailedBadge();
		} else {
			if (initialized) {
				showBuildFixedBadge();
			} else {
				showStateUnknownBadge();
			}
		}
	}

	return badgeController;
});