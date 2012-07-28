define([
	'AjaxRequest',
	'amdUtils/string/interpolate'
], function (AjaxRequest, interpolate) {

	'use strict';

	function logger() {
		
		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	return logger;
});