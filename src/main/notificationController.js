define([
	'main/serviceController',
	'common/timer',
	'mout/string/interpolate',
	'mout/array/remove'
], function (serviceController, Timer, interpolate, remove) {

	'use strict';
	
	var notificationTimeoutInSec = 5;
	var eventsSubscription;

	function notificationController() {

		function onBrokenBuild(event) {
			var notificationInfo = {
				id: event.details.serviceName + event.details.group + event.details.name,
				message: 'Build failed - ' + event.details.serviceName,
				details: event.details.name + (event.details.group ? ' (' + event.details.group + ')' : ''),
				url: event.details.webUrl,
				icon: 'src/services/' + event.details.serviceIcon,
				sticky: !reloading
			};
			showNotification(notificationInfo);
		}

		function onFixedBuild(event) {
			var notificationInfo = {
				id: event.details.serviceName + event.details.group + event.details.name,
				message: 'Build fixed - ' + event.details.serviceName,
				details: event.details.name + (event.details.group ? ' (' + event.details.group + ')' : ''),
				url: event.details.webUrl,
				icon: 'src/services/' + event.details.serviceIcon,
				sticky: false
			};
			showNotification(notificationInfo);
		}

		function showNotification(notificationInfo) {
			hideOutdated(notificationInfo.id);
			var notification = createNotification(notificationInfo);
			notification.show();
			visibleNotifications.push({ notification: notification, notificationInfo: notificationInfo });
			if (!notificationInfo.sticky) {
				var timer = new Timer();
				timer.on.elapsed.addOnce(function () { notification.cancel(); });
				timer.start(notificationTimeoutInSec);
			}
		}

		function hideOutdated(id) {
			visibleNotifications.filter(function (d) {
				return d.notificationInfo.id === id;
			}).forEach(function (d) {
				d.notification.cancel();
			});
		}

		function createNotification(notificationInfo) {

			function onNotificationClick() {
				chrome.tabs.create({'url': notificationInfo.url}, function (tab) {
					notification.cancel();
				});
			}

			function onNotificationClose() {
				visibleNotifications.filter(function (d) {
					return d.notification === this;
				}).forEach(function (d) {
					remove(visibleNotifications, d);
				});
			}

			var notification = window.webkitNotifications.createNotification(
				notificationInfo.icon,
				notificationInfo.message,
				notificationInfo.details
			);
			notification.onclick = onNotificationClick;
			notification.onclose = onNotificationClose;
			return notification;
		}

		var eventHandlers = {
			'servicesInitializing': function () {
				reloading = true;
			},
			'servicesInitialized': function () {
				reloading = false;
			},
			'buildBroken': onBrokenBuild,
			'buildFixed': onFixedBuild
		};
		var visibleNotifications = [];
		var reloading = false;
		return serviceController.events.doAction(function (event) {
			var handler = eventHandlers[event.eventName];
			if (handler) {
				handler(event);
			}
		}).subscribe();
	}
	
	notificationController.notificationTimeoutInSec = function (value) {
		if (!arguments.count) { return notificationTimeoutInSec; }
		notificationTimeoutInSec = value;
		return notificationController;
	};

	return notificationController;
});
