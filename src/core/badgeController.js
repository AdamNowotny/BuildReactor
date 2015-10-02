/* global chrome: false */
define([
	'core/services/serviceController'
], function (serviceController) {
	
	'use strict';

	var colors = {
		grey: [200, 200, 200, 200],
		red: [255, 0, 0, 200],
		green: [0, 255, 0, 200]
	};

	function badgeController() {
		var servicesStarted = false;
		var failedBuildsCount = 0;
		var offlineBuildsCount = 0;
		var eventHandlers = {
			'servicesInitializing': function () {
				servicesStarted = false;
				failedBuildsCount = 0;
				offlineBuildsCount = 0;
				updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
			},
			'servicesInitialized': function () {
				servicesStarted = true;
				updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
			},
			'buildBroken': function (event) {
				if (event.details && event.details.isDisabled) {
					return;
				}
				failedBuildsCount++;
				updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
			},
			'buildFixed': function (event) {
				if (event.details && event.details.isDisabled) {
					return;
				}
				failedBuildsCount = Math.max(failedBuildsCount - 1, 0);
				updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
			},
			'buildOffline': function () {
				offlineBuildsCount++;
				updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
			},
			'buildOnline': function () {
				offlineBuildsCount--;
				updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
			}
		};
		updateBadge(failedBuildsCount, servicesStarted, offlineBuildsCount);
		return serviceController.events.doAction(function (event) {
			var handler = eventHandlers[event.eventName];
			if (handler) {
				handler(event);
			}
		}).subscribe();
	}

	function updateBadge(failedBuildsCount, initialized, offlineBuildsCount) {
	
		function setBadge(text, color) {
			chrome.browserAction.setBadgeText({ text: text });
			chrome.browserAction.setBadgeBackgroundColor({ color: color });
		}

		var color = colors.green;
		var text = '';
		if (!initialized || offlineBuildsCount) {
			color = colors.grey;
			text = failedBuildsCount ? failedBuildsCount.toString() : ' ';			
		} else if (failedBuildsCount) {
			color = colors.red;
			text = failedBuildsCount.toString();
		}
		setBadge(text, color);
	}

	return badgeController;
});