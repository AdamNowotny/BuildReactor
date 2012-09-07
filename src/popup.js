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
], function () {

	'use strict';
	
	// optionsController.on.settingsChanged.add(function (updatedSettings) {
	// chrome.extension.sendMessage({name: "updateSettings", settings: updatedSettings});
	// });
	// chrome.extension.sendMessage({ name: "initOptions" }, function (response) {
	// optionsController.initialize(response.serviceTypes);
	// optionsController.load(response.settings);
	// });
});
