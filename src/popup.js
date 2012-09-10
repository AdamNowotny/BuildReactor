require.config({
	baseUrl: 'src',
	paths: {
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: '../lib/jquery/jquery',
		signals: '../lib/js-signals/signals'
	},
	shim: {
		bootstrap: [ 'jquery' ]
	}
});
require([
	'popupController'
], function (popupController) {

	'use strict';
	
	chrome.extension.sendMessage({ name: "serviceStateRequest" }, function (response) {
		popupController.show(response.serviceState);
	});
});
