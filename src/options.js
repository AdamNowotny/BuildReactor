require.config({
	baseUrl: 'src',
	paths: {
		amdUtils: '../lib/amd-utils',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		handlebars: '../lib/requirejs-handlebars-plugin/Handlebars',
		jquery: '../lib/jquery/jquery',
		jqueryTools: '../lib/jquery-tools/jquery.tools.min',
		signals: '../lib/js-signals/signals',
		text: '../lib/requirejs/text'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		jqueryTools: [ 'jquery' ]
	}
});
require([
	'settingsPageController',
	'amdUtils/string/interpolate'
], function (settingsPageController, interpolate) {

	'use strict';
	
	function initializeLogging() {
		window.onerror = function (message, url, line) {
			console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	function settingsChanged(updatedSettings) {
		app.updateSettings(updatedSettings);
	}

	initializeLogging();
	// app already loaded
	var app = chrome.extension.getBackgroundPage().require("app");
	settingsPageController.initialize(app.getSupportedServiceTypes());
	settingsPageController.settingsChanged.add(settingsChanged);
	settingsPageController.load(app.getSettings());
	
});
