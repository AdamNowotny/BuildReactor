define([
	'core/services/serviceController',
	'core/config/serviceConfiguration',
	'mout/string/interpolate'
], function (serviceController, serviceConfiguration, interpolate) {

	'use strict';

	return function () {
		serviceController.events.subscribe(function (event) {
			console.log(new Date().toJSON(), event.source, event.eventName, event.details);
		}, function () {
			console.error(new Date().toJSON(), 'serviceController.events stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'serviceController.events stream completed', arguments);
		});

		serviceController.activeProjects.subscribe(function (state) {
			console.log(new Date().toJSON(), 'serviceController.activeProjects', state);
		}, function () {
			console.error(new Date().toJSON(), 'serviceController.activeProjects stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'serviceController.activeProjects stream completed', arguments);
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
