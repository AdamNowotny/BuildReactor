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

		function onBrokenBuild(buildEvent) {
			failedBuildsCount++;
			updateBadge();
		}

		function onFixedBuild(buildEvent) {
			failedBuildsCount--;
			updateBadge();
		}

		function onServicesStarted() {
			servicesStarted = true;
			updateBadge();
		}
		
		function onReset() {
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
		serviceController.on.reloading.add(onReset);
		serviceController.on.startedAll.add(onServicesStarted);
		serviceController.on.brokenBuild.add(onBrokenBuild);
		serviceController.on.fixedBuild.add(onFixedBuild);
	}

	

	return badgeController;
});