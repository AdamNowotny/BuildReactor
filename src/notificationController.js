define([
	'serviceController',
	'timer',
	'amdUtils/string/interpolate'
], function (serviceController, Timer, interpolate) {

	'use strict';
	
	var notificationTimeoutInSec = 5;

	function initialize() {
		serviceController.buildFailed.add(onBuildFailed);
		serviceController.buildFixed.add(onBuildFixed);
	}

	function onBuildFailed(buildEvent) {
		var notification = {
			message: interpolate('Build failed - {{0}}', [buildEvent.serviceName]),
			details: buildEvent.buildName + (buildEvent.group ? ' (' + buildEvent.group + ')' : ''),
			url: buildEvent.url,
			backgroundColor: '#0D0',
			sticky: true,
			icon: buildEvent.icon
		};
		showNotification(notification);
	}

	function onBuildFixed(buildEvent) {

		function fixedNotification(buildEvent) {
			return {
				message: interpolate('Build fixed - {{0}}', [buildEvent.serviceName]),
				details: buildEvent.buildName + (buildEvent.group ? ' (' + buildEvent.group + ')' : ''),
				url: buildEvent.url,
				backgroundColor: '#D00',
				icon: buildEvent.icon
			};
		}
		
		var notification = fixedNotification(buildEvent);
		showNotification(notification);
	}

	function showNotification(notificationInfo) {
		function closeNotification() {
			notification.cancel();
		}

		var notification = window.webkitNotifications.createNotification(
			'src/' + notificationInfo.icon,
			notificationInfo.message,
			notificationInfo.details
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
