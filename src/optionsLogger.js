define([
	'AjaxRequest',
	'amdUtils/string/interpolate'
], function (AjaxRequest, interpolate) {

	'use strict';

	function logger() {
		AjaxRequest.prototype.on.responseReceived.add(function (response) {
			console.log('Ajax response received: ', response);
		});
		AjaxRequest.prototype.on.errorReceived.add(function (errorInfo) {
			console.log('Error response:', errorInfo);
		});

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	return logger;
});