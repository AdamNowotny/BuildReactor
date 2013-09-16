define([
	'common/core',
	'mout/string/interpolate'
], function (core, interpolate) {

	'use strict';

	return function () {
		core.activeProjects.subscribe(function (state) {
			console.log(new Date().toJSON(), 'core', state);
		}, function () {
			console.error(new Date().toJSON(), 'ActiveProjects stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'ActiveProjects stream completed', arguments);
		});

		window.onerror = function (message, url, line) {
			var displayMessage = interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]);
			window.console.error(displayMessage);
			alert(displayMessage);
			return false; // don't suppress default handling
		};
	};
});
