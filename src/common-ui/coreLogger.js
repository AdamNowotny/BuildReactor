define([
	'common-ui/core',
	'mout/string/interpolate'
], function (core, interpolate) {

	'use strict';

	return function () {
		core.activeProjects.subscribe(function (state) {
			console.log(new Date().toJSON(), 'core.activeProjects', state);
		}, function () {
			console.error(new Date().toJSON(), 'core.activeProjects stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'core.activeProjects stream completed', arguments);
		});

		core.configurations.subscribe(function (state) {
			console.log(new Date().toJSON(), 'core.configurations', state);
		}, function () {
			console.error(new Date().toJSON(), 'core.configurations stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'core.configurations stream completed', arguments);
		});

		core.views.subscribe(function (state) {
			console.log(new Date().toJSON(), 'core.views', state);
		}, function () {
			console.error(new Date().toJSON(), 'core.views stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'core.views stream completed', arguments);
		});

		core.messages.subscribe(function (state) {
			console.log(new Date().toJSON(), 'core.messages', state);
		}, function () {
			console.error(new Date().toJSON(), 'core.messages stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'core.messages stream completed', arguments);
		});

		window.onerror = function (message, url, line) {
			var displayMessage = interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]);
			window.console.error(displayMessage);
			alert(displayMessage);
			return false; // don't suppress default handling
		};
	};
});
