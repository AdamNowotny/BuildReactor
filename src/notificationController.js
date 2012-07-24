define([
	'serviceController',
	'timer',
	'amdUtils/string/interpolate'
], function (serviceController, Timer, interpolate) {

	'use strict';
	
	var notificationTimeoutInSec = 5;

	function initialize() {
		updateBadge(null);
		serviceController.servicesStarted.add(onServicesStarted);
		serviceController.buildFailed.add(onBuildFailed);
		serviceController.buildFixed.add(onBuildFixed);
	}

	function onServicesStarted(state) {
		updateBadge(state);
	}

	function onBuildFailed(buildEvent) {
		var notification = {
			message: interpolate('Build failed - {{0}}', [buildEvent.serviceName]),
			details: buildEvent.buildName + (buildEvent.group ? ' (' + buildEvent.group + ')' : ''),
			url: buildEvent.url,
			backgroundColor: '#0D0',
			sticky: true
		};
		showNotification(notification);
		updateBadge(buildEvent.state);
	}

	function onBuildFixed(buildEvent) {

		function fixedNotification(buildEvent) {
			return {
				message: interpolate('Build fixed - {{0}}', [buildEvent.serviceName]),
				details: buildEvent.buildName + (buildEvent.group ? ' (' + buildEvent.group + ')' : ''),
				url: buildEvent.url,
				backgroundColor: '#D00'
			};
		}
		
		var notification = fixedNotification(buildEvent);
		showNotification(notification);
		updateBadge(buildEvent.state);
	}

	function updateBadge(state) {
		
		function showBuildFailedBadge(state) {
			var badgeInfo = {
				text: state.failedBuildsCount.toString(),
				color: [255, 0, 0, 200]
			};
			setBadge(badgeInfo);
		}

		function showBuildFixedBadge() {
			var badgeInfo = {
				text: '\u2022',
				color: [0, 255, 0, 200]
			};
			setBadge(badgeInfo);
		}

		function showStateUnknownBadge() {
			var badgeInfo = {
				text: ' ',
				color: [200, 200, 200, 200]
			};
			setBadge(badgeInfo);
		}

		function setBadge(badgeInfo) {
			chrome.browserAction.setBadgeText({ text: badgeInfo.text });
			chrome.browserAction.setBadgeBackgroundColor({ color: badgeInfo.color });
		}

		if (!state) {
			showStateUnknownBadge();
		} else if (state.failedBuildsCount === 0) {
			showBuildFixedBadge();
		} else {
			showBuildFailedBadge(state);
		}

	}

	function showNotification(notificationInfo) {
		function closeNotification() {
			notification.cancel();
		}

		var notification = window.webkitNotifications.createNotification(
			"img/icon-128.png", // The image.
			notificationInfo.message, // The title.
			notificationInfo.details // The body.
		);
		notification.show();
		if (!notificationInfo.sticky) {
			var timer = new Timer();
			timer.elapsed.addOnce(closeNotification);
			timer.start(notificationTimeoutInSec);
		}
	}

	return {
		initialize: initialize
	};
});
