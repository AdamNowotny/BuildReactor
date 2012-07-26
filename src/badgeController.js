define([
	'serviceController'
], function (serviceController) {
	
	'use strict';

	var colors = {
		grey: [200, 200, 200, 200],
		red: [255, 0, 0, 200]
	};

	function badgeController() {

		function onBuildFailed(buildEvent) {
			failedBuildsCount++;
			updateBadge();
		}

		function onBuildFixed(buildEvent) {
			failedBuildsCount--;
			updateBadge();
		}

		function onServicesStarted() {
			servicesStarted = true;
			updateBadge();
		}
		
		function onStartedLoading() {
			servicesStarted = false;
			failedBuildsCount = 0;
			updateBadge();
		}

		function updateBadge() {
		
			function showBuildFailedBadge() {
				var badgeInfo = {
					text: failedBuildsCount.toString(),
					color: colors.red
				};
				setBadge(badgeInfo);
			}

			function showBuildFixedBadge() {
				var badgeInfo = {
					text: ''
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
				if (servicesStarted) {
					showBuildFixedBadge();
				} else {
					showStateUnknownBadge();
				}
			}
		}

		var servicesStarted = false;
		var failedBuildsCount = 0;
		updateBadge(failedBuildsCount);
		serviceController.startedLoading.add(onStartedLoading);
		serviceController.servicesStarted.add(onServicesStarted);
		serviceController.buildFailed.add(onBuildFailed);
		serviceController.buildFixed.add(onBuildFixed);
	}

	

	return badgeController;
});