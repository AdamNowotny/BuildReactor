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

        function onStartedBuild(buildEvent) {
            runningBuildsCount++;
            updateBadge();
        }

        function onFinishedBuild(buildEvent) {
            runningBuildsCount--;
            updateBadge();
        }

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
					color: colors.red,
                    rotating: runningBuildsCount > 0
				};
				setBadge(badgeInfo);
			}

			function showBuildFixedBadge() {
				var badgeInfo = {
					text: '',
					color: colors.green,
                    rotating: runningBuildsCount > 0
				};
				setBadge(badgeInfo);
			}

			function showStateUnknownBadge() {
				var badgeInfo = {
					text: ' ',
					color: colors.grey,
                    rotating: runningBuildsCount > 0
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

        function updateIcon() {
            var image = iconImage;
            iconContext.clearRect(0, 0, 19, 19);
            if (Math.round(iconRotation / 20) % 2 === 0) {
                image = iconFlashImage;
            }
            if (runningBuildsCount === 0) {
                iconRotation = 0;
                image = iconImage;
            }
            iconContext.translate(9, 9);
            iconContext.rotate(iconRotation / 180 * 2 * Math.PI);
            iconContext.drawImage(image, -18, -18, 36, 36);
            iconContext.rotate(-iconRotation / 180 * 2 * Math.PI);
            iconContext.translate(-9, -9);
            chrome.browserAction.setIcon({ imageData: iconContext.getImageData(0, 0, 19, 19) });
            iconRotation += 1;
            if (iconRotation >= 360) {
                iconRotation -= 360;
            }
            window.setTimeout(updateIcon, 10);
        }

		var servicesStarted = false;
		var failedBuildsCount = 0;
        var runningBuildsCount = 0;
        var iconImage = document.createElement('img');
        var iconFlashImage = document.createElement('img');
        var iconCanvas = document.createElement('canvas');
        iconImage.src = 'img/icon-48-build-off.png';
        iconFlashImage.src = 'img/icon-48-build-on.png';
        iconCanvas.width = 19;
        iconCanvas.height = 19;
        var iconRotation = 0;
        var iconContext = iconCanvas.getContext('2d');
		updateBadge(failedBuildsCount, runningBuildsCount);
        window.setTimeout(updateIcon, 10);
		serviceController.on.reloading.add(onReset);
		serviceController.on.startedAll.add(onServicesStarted);
		serviceController.on.brokenBuild.add(onBrokenBuild);
		serviceController.on.fixedBuild.add(onFixedBuild);
		serviceController.on.startedBuild.add(onStartedBuild);
		serviceController.on.finishedBuild.add(onFinishedBuild);
	}

	

	return badgeController;
});
