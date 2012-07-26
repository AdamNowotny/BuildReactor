define([
	'serviceController',
	'timer',
	'amdUtils/string/interpolate'
], function (serviceController, Timer, interpolate) {

	'use strict';
	
	var notificationTimeoutInSec = 5;

	function initialize() {
		serviceController.on.brokenBuild.add(onBrokenBuild);
		serviceController.on.fixedBuild.add(onFixedBuild);
	}

	function onBrokenBuild(buildEvent) {
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

	function onFixedBuild(buildEvent) {

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
			timer.on.elapsed.addOnce(closeNotification);
			timer.start(notificationTimeoutInSec);
		}
	}

	return {
		initialize: initialize
	};
});
