/* global chrome: false, Notification: false */
define([
	'core/events',
	'rx',
	'mout/string/interpolate',
	'common/tags',
	'common/chromeApi',
	'rx.time'
], function (events, Rx, interpolate, tags, chromeApi) {

	'use strict';
	
	function init(options) {

		function createPasswordExpiredMessage(event) {
			return {
				id: event.source + '_disabled',
				title: event.source,
				url: 'settings.html',
				icon: 'src/core/services/' + event.details.serviceIcon,
				text: 'Password expired. Service has been disabled.'
			};
		}
		
		function createBuildBrokenMessage(event) {
			if (tags.contains('Unstable', event.details.tags)) {
				return createNotificationInfo(event.details, 'Unstable, broken', options.timeout);
			} else {
				return createNotificationInfo(event.details, 'Broken');
			}
		}

		function createBuildFixedMessage(event) {
			return createNotificationInfo(event.details, 'Fixed', options.timeout);
		}

		function isBuildEnabled(event) {
			return !event.details.isDisabled;
		}

		function isInitialized(event) {
			return !reloading;
		}

		function whenDashboardInactive(event) {
			return chromeApi.isDashboardActive().where(function (active) {
				return !active;
			}).select(function (active) {
				return event;
			});
		}

		function createNotificationInfo(eventDetails, message, timeout) {

			function createId(eventDetails) {
				return eventDetails.group ?
					interpolate('{{0}}_{{1}}_{{2}}', [ eventDetails.serviceName, eventDetails.group, eventDetails.name ]) :
					interpolate('{{0}}_{{1}}', [ eventDetails.serviceName, eventDetails.name ]);
			}

			function createTitle(eventDetails) {
				return eventDetails.group ?
					interpolate('{{0}} / {{1}} ({{2}})', [ eventDetails.group, eventDetails.name, eventDetails.serviceName ]) :
					interpolate('{{0}} ({{1}})', [ eventDetails.name, eventDetails.serviceName ]);
			}

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
				id: createId(eventDetails),
				title: createTitle(eventDetails),
				url: eventDetails.webUrl,
				icon: 'src/core/services/' + eventDetails.serviceIcon,
				timeout: timeout ? timeout : undefined,
				text:  createChangesMessage(eventDetails.changes)
			};
			return info;
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
				var notification = new Notification(info.title, {
					icon: info.icon,
					body: info.text,
					tag: info.id
				});
				notification.onclick = function () {
					chrome.tabs.create({'url': info.url}, function (tab) {
						notification.close();
					});
				};
				notification.onclose = function () {
					observer.onCompleted();
				};
				if (info.timeout) {
					notification.onshow = function () {
						Rx.Observable.timer(info.timeout, scheduler).subscribe(function () {
							notification.close();
						});
					};
				}
				return function () {
					notification.close();
				};
			});
		}

		var scheduler = options.scheduler || Rx.Scheduler.timeout;
		var visibleNotifications = {};
		var reloading = false;

		var buildBroken = events.getByName('buildBroken')
			.where(isInitialized)
			.where(isBuildEnabled)
			.selectMany(whenDashboardInactive)
			.select(createBuildBrokenMessage);
		var buildFixed = events.getByName('buildFixed')
			.where(isInitialized)
			.where(isBuildEnabled)
			.selectMany(whenDashboardInactive)
			.select(createBuildFixedMessage);
		var passwordExpired = events.getByName('passwordExpired')
			.select(createPasswordExpiredMessage);

		events.getByName('servicesInitializing').subscribe(function () {
			reloading = true;
		});
		events.getByName('servicesInitialized').subscribe(function () {
			reloading = false;
		});

		passwordExpired
			.merge(buildBroken)
			.merge(buildFixed)
			.subscribe(function (notification) {
				notification && showNotification(notification);
			});
	}
	
	return {
		init: init
	};
});
