define([
	'ajaxRequest',
	'amdUtils/string/interpolate',
	'has'
], function (AjaxRequest, interpolate, has) {

	'use strict';

	function logger() {

		if (has('debug')) {
			AjaxRequest.prototype.all.responseReceived.add(function (response) {
				console.log('AjaxRequest.responseReceived: ', response);
			});
			AjaxRequest.prototype.all.errorReceived.add(function (errorInfo) {
				console.log('AjaxRequest.errorReceived: ', errorInfo);
			});
		}

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	return logger;
});