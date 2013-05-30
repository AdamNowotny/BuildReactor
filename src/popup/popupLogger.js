define([
	'popup/messages',
	'mout/string/interpolate'
], function (messages, interpolate) {

	'use strict';

	return function () {
		messages.activeProjects.subscribe(function (state) {
			console.log(new Date().toJSON(), 'messages', state);
		}, function () {
			console.error(new Date().toJSON(), 'ActiveProjects stream error', arguments);
		}, function () {
			console.warn(new Date().toJSON(), 'ActiveProjects stream completed', arguments);
		});

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	};
});
