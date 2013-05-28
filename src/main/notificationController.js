define([
	'main/serviceController',
	'rx',
	'rx.time'
], function (serviceController, Rx) {

	'use strict';
	
	function init(options) {

		function createNotificationInfo(event) {
			return {
				id: event.details.serviceName + event.details.group + event.details.name,
				title: event.details.name + (event.details.group ? ' (' + event.details.group + ')' : ''),
				url: event.details.webUrl,
				icon: 'src/services/' + event.details.serviceIcon,
				timeout: options.timeout
			};
		}

		function onBrokenBuild(event) {
			var info = createNotificationInfo(event);
			info.text = 'Broken';
			if (!reloading) {
				delete info.timeout;
			}
			showNotification(info);
		}

		function onFixedBuild(event) {
			var info = createNotificationInfo(event);
			info.text = 'Fixed';
			showNotification(info);
		}

		function showNotification(info) {
			if (visibleNotifications[info.id]) {
				visibleNotifications[info.id].dispose();
			}
			visibleNotifications[info.id] = createNotification(info).subscribe(undefined, undefined, function () {
				delete visibleNotifications[info.id];
			});
		}

		function createNotification(info) {
			return Rx.Observable.create(function (observer) {
				var notification = window.webkitNotifications.createNotification(info.icon, info.title, info.text);
				notification.onclick = function () {
					chrome.tabs.create({'url': info.url}, function (tab) {
						notification.cancel();
					});
				};
				notification.onclose = function () {
					observer.onCompleted();
				};
				notification.show();
				if (info.timeout) {
					Rx.Observable.timer(info.timeout, scheduler).subscribe(function () {
						notification.cancel();
					});
				}
				return function () {
					notification.cancel();
				};
			});
		}

		var scheduler = options.scheduler || Rx.Scheduler.timeout;
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
		var eventsSubscription;
		var visibleNotifications = {};
		var reloading = false;

		return serviceController.events.doAction(function (event) {
			if (event.details && event.details.isDisabled) { 
				return;
			}
			var handler = eventHandlers[event.eventName];
			if (handler) {
				handler(event);
			}
		}).subscribe();
	}
	
	return {
		init: init
	};
});
