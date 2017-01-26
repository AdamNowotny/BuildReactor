/* global chrome: false, Notification: false */
import 'rx/dist/rx.time';
import Rx from 'rx';
import chromeApi from 'common/chromeApi';
import events from 'core/events';
import tags from 'common/tags';

function init(options) {

	function createPasswordExpiredMessage(event) {
		return {
			id: event.source + '_disabled',
			title: event.source,
			url: 'settings.html',
			icon: event.details.serviceIcon,
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
		return chromeApi.isDashboardActive().where(function(active) {
			return !active;
		}).select(function(active) {
			return event;
		});
	}

	function createNotificationInfo(eventDetails, message, timeout) {

		function createId(eventDetails) {
			return eventDetails.group ?
				`${eventDetails.serviceName}_${eventDetails.group}_${eventDetails.name}` :
				`${eventDetails.serviceName}_${eventDetails.name}`;
		}

		function createTitle(eventDetails) {
			return eventDetails.group ?
				`${eventDetails.group} / ${eventDetails.name} (${eventDetails.serviceName})` :
				`${eventDetails.name} (${eventDetails.serviceName})`;
		}

		function createChangesMessage(changes) {
			return changes ? message + changes.reduce(function(agg, change, i) {
				if (i === 4) {
					return agg + ', ...';
				}
				if (i > 4) {
					return agg;
				}
				return agg ? agg + ', ' + change.name : ' by ' + change.name;
			}, '') : message;
		}

		var info = {
			id: createId(eventDetails),
			title: createTitle(eventDetails),
			url: eventDetails.webUrl,
			icon: eventDetails.serviceIcon,
			timeout: timeout ? timeout : undefined,
			text:  createChangesMessage(eventDetails.changes)
		};
		return info;
	}

	function showNotification(info) {
		if (visibleNotifications[info.id]) {
			visibleNotifications[info.id].dispose();
		}
		visibleNotifications[info.id] = createNotification(info).subscribe(() => {}, () => {}, function() {
			delete visibleNotifications[info.id];
		});
	}

	function createNotification(info) {
		return Rx.Observable.create(function(observer) {
			var notification = new Notification(info.title, {
				icon: info.icon,
				body: info.text,
				tag: info.id
			});
			notification.onclick = function() {
				chrome.tabs.create({ 'url': info.url }, function(tab) {
					notification.close();
				});
			};
			notification.onclose = function() {
				observer.onCompleted();
			};
			if (info.timeout) {
				notification.onshow = function() {
					Rx.Observable.timer(info.timeout, scheduler).subscribe(function() {
						notification.close();
					});
				};
			}
			return function() {
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

	events.getByName('servicesInitializing').subscribe(function() {
		reloading = true;
	});
	events.getByName('servicesInitialized').subscribe(function() {
		reloading = false;
	});

	passwordExpired
		.merge(buildBroken)
		.merge(buildFixed)
		.subscribe(function(notification) {
			if (notification) {
				showNotification(notification);
			}
		});
}

export default {
	init
};
