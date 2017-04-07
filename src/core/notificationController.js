/* global chrome: false, Notification: false */
import 'rx/dist/rx.time';
import Rx from 'rx';
import chromeApi from 'common/chromeApi';
import events from 'core/events';
import serviceController from 'core/services/serviceController';
import tags from 'common/tags';

function init(options) {

	function createPasswordExpiredMessage(event) {
		return {
			id: `${event.source}_disabled`,
			title: event.source,
			url: 'settings.html',
			icon: serviceController.typeInfoFor(event.source).icon,
			text: 'Password expired. Service has been disabled.'
		};
	}

	function createBuildBrokenMessage(event) {
		if (tags.contains('Unstable', event.details.tags)) {
			return createNotificationInfo(event, 'Unstable, broken', options.timeout);
		} else {
			return createNotificationInfo(event, 'Broken');
		}
	}

	function createBuildFixedMessage(event) {
		return createNotificationInfo(event, 'Fixed', options.timeout);
	}

	function whenDashboardInactive(event) {
		return chromeApi
			.isDashboardActive()
			.where((active) => !active)
			.select(() => event);
	}

	function createNotificationInfo(event, message, timeout) {

		function createId(eventDetails) {
			return eventDetails.group ?
				`${event.source}_${eventDetails.group}_${eventDetails.name}` :
				`${event.source}_${eventDetails.name}`;
		}

		function createTitle(eventDetails) {
			return eventDetails.group ?
				`${eventDetails.group} / ${eventDetails.name} (${event.source})` :
				`${eventDetails.name} (${event.source})`;
		}

		function createChangesMessage(changes) {
			return changes ? message + changes.reduce((agg, change, i) => {
				if (i === 4) {
					return `${agg}, ...`;
				}
				if (i > 4) {
					return agg;
				}
				return agg ? `${agg}, ${change.name}` : ` by ${change.name}`;
			}, '') : message;
		}

		const info = {
			id: createId(event.details),
			title: createTitle(event.details),
			url: event.details.webUrl,
			icon: serviceController.typeInfoFor(event.source).icon,
			timeout: timeout ? timeout : undefined,
			text: createChangesMessage(event.details.changes)
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
		return Rx.Observable.create((observer) => {
			const notification = new Notification(info.title, {
				icon: info.icon,
				body: info.text,
				tag: info.id
			});
			notification.onclick = function() {
				chrome.tabs.create({ 'url': info.url }, (tab) => {
					notification.close();
				});
			};
			notification.onclose = function() {
				observer.onCompleted();
			};
			if (info.timeout) {
				notification.onshow = function() {
					Rx.Observable.timer(info.timeout, scheduler).subscribe(() => {
						notification.close();
					});
				};
			}
			return function() {
				notification.close();
			};
		});
	}

	const scheduler = options.scheduler || Rx.Scheduler.timeout;
	const visibleNotifications = {};
	let reloading = false;

	const buildBroken = events.getByName('buildBroken')
		.where((event) => !reloading)
		.where((event) => !event.details.isDisabled)
		.selectMany(whenDashboardInactive)
		.select(createBuildBrokenMessage);
	const buildFixed = events.getByName('buildFixed')
		.where((event) => !reloading)
		.where((event) => !event.details.isDisabled)
		.selectMany(whenDashboardInactive)
		.select(createBuildFixedMessage);
	const passwordExpired = events.getByName('passwordExpired')
		.select(createPasswordExpiredMessage);

	events.getByName('servicesInitializing').subscribe(() => {
		reloading = true;
	});
	events.getByName('servicesInitialized').subscribe(() => {
		reloading = false;
	});

	passwordExpired
		.merge(buildBroken)
		.merge(buildFixed)
		.where((ev) => ev)
		.subscribe((ev) => showNotification(ev));
}

export default {
	init
};
