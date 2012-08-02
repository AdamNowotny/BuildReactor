define([
	'serviceController',
	'timer',
	'amdUtils/string/interpolate'
], function (serviceController, Timer, interpolate) {

	'use strict';
	
	var notificationTimeoutInSec = 5;

	function notificationController() {

		function onBrokenBuild(buildEvent) {
			var notification = {
				message: interpolate('Build failed - {{0}}', [buildEvent.serviceName]),
				details: buildEvent.buildName + (buildEvent.group ? ' (' + buildEvent.group + ')' : ''),
				url: buildEvent.url,
				backgroundColor: '#0D0',
				sticky: startedAll,
				icon: buildEvent.icon
			};
			showNotification(notification);
		}

		function onFixedBuild(buildEvent) {

			var notification = {
				message: interpolate('Build fixed - {{0}}', [buildEvent.serviceName]),
				details: buildEvent.buildName + (buildEvent.group ? ' (' + buildEvent.group + ')' : ''),
				url: buildEvent.url,
				backgroundColor: '#D00',
				sticky: false,
				icon: buildEvent.icon
			};
			showNotification(notification);
		}

		function onStartedAll() {
			startedAll = true;
		}

		function showNotification(notificationInfo) {

			function onNotificationClick() {
				chrome.tabs.create({'url': notificationInfo.url}, function (tab) {
					notification.cancel();
				});
			}

			var notification = window.webkitNotifications.createNotification(
				'src/' + notificationInfo.icon,
				notificationInfo.message,
				notificationInfo.details
			);
			notification.onclick = onNotificationClick;
			notification.show();
			if (!notificationInfo.sticky) {
				var timer = new Timer();
				timer.on.elapsed.addOnce(function () { notification.cancel(); });
				timer.start(notificationTimeoutInSec);
			}
		}

		var startedAll = false;
		serviceController.on.brokenBuild.add(onBrokenBuild);
		serviceController.on.fixedBuild.add(onFixedBuild);
		serviceController.on.startedAll.add(onStartedAll);
	}
	
	notificationController.notificationTimeoutInSec = function (value) {
		if (!arguments.count) { return notificationTimeoutInSec; }
		notificationTimeoutInSec = value;
		return notificationController;
	};

	return notificationController;
});
