define([
	'core/services/serviceController',
	'core/services/serviceConfiguration',
	'mout/string/interpolate',
	'core/messageHandlers'
], function (serviceController, serviceConfiguration, interpolate, messageHandlers) {

	'use strict';

	return function () {
		serviceController.events.subscribe(function (event) {
			console.log(new Date().toJSON(), event.source, event.eventName, event.details);
		}, function () {
			console.error(new Date().toJSON(), 'serviceController.events stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'serviceController.events stream completed', arguments);
		});

		messageHandlers.messages.subscribe(function (message) {
			console.log(new Date().toJSON(), 'messageHandlers.messages', message);
		}, function () {
			console.error(new Date().toJSON(), 'messageHandlers.messages stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'messageHandlers.messages stream completed', arguments);
		});

		serviceConfiguration.changes.subscribe(function (config) {
			console.log(new Date().toJSON(), 'serviceConfiguration.changes', config);
		}, function () {
			console.error(new Date().toJSON(), 'serviceConfiguration.changes stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'serviceConfiguration.changes stream completed', arguments);
		});

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	};
});
