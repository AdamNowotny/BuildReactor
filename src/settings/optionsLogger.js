define(['amdUtils/string/interpolate'], function (interpolate) {

	'use strict';

	function logger() {

		window.onerror = function (message, url, line) {
			var displayMessage = interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]);
			window.console.error(displayMessage);
			alert(displayMessage);
			return false; // don't suppress default handling
		};
	}

	return logger;
});