define([
	'main/serviceController',
	'rx',
	'common/tags',
	'rx.time'
], function (serviceController, Rx, tags) {

	'use strict';
	
	function init(options) {

		function createNotificationInfo(event, message, timeout) {

			function createChangesMessage(changes) {
				return !changes ? message : message + changes.reduce(function (agg, change, i) {
					if (i === 4) {
						return agg + ', ...';
					}
					if (i > 4) {
						return agg;
					}
					return agg ? agg + ', ' + change.name : ' by ' + change.name;
				}, '');
			}

			var info = {
				id: event.details.serviceName + event.details.group + event.details.name,
				title: event.details.name + (event.details.group ? ' (' + event.details.group + ')' : ''),
				url: event.details.webUrl,
				icon: 'src/services/' + event.details.serviceIcon,
				timeout: timeout ? timeout : undefined,
				text:  createChangesMessage(event.details.changes)
			};
			return info;
		}

		function onBrokenBuild(event) {
			if (reloading) {
				return;
			}
			if (tags.contains('Unstable', event.details.tags)) {
				showNotification(createNotificationInfo(event, 'Unstable, broken', options.timeout));
			} else {
				showNotification(createNotificationInfo(event, 'Broken'));
			}
		}

		function onFixedBuild(event) {
			if (reloading) {
				return;
			}
			showNotification(createNotificationInfo(event, 'Fixed', options.timeout));
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
					notification.ondisplay = function () {
						Rx.Observable.timer(info.timeout, scheduler).subscribe(function () {
							notification.cancel();
						});
					};
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
			var handler = eventHandlers[event.eventName];
			var isDisabled = event.details && event.details.isDisabled;
			if (!isDisabled && handler) { 
				handler(event);
			}
		}).subscribe();
	}
	
	return {
		init: init
	};
});
