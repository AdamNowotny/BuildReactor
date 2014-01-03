define([
	'core/services/serviceController',
	'core/settingsStore',
	'mout/string/interpolate',
	'core/messageHandlers'
], function (serviceController, settingsStore, interpolate, messageHandlers) {

	'use strict';

	return function () {
		serviceController.events.subscribe(function (event) {
			console.log(new Date().toJSON(), event.source, event.eventName, event.details);
		}, function () {
			console.error(new Date().toJSON(), 'Event stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'Event stream completed', arguments);
		});

		messageHandlers.messages.subscribe(function (message) {
			console.log(new Date().toJSON(), 'messageHandlers', message);
		}, function () {
			console.error(new Date().toJSON(), 'messageHandlers stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'messageHandlers stream completed', arguments);
		});

		settingsStore.on.storedSettings.add(function (settings) {
			console.log(new Date().toJSON(), 'settingsStore.storedSettings: ', settings);
		});

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	};
});
