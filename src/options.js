require.config({
	baseUrl: 'src',
	paths: {
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: '../lib/jquery/jquery',
		jqueryTools: '../lib/jquery-tools/jquery.tools.min',
		signals: '../lib/js-signals/signals'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		jqueryTools: [ 'jquery' ]
	}
});
require([
	'settingsPageController',
	'optionsLogger'
], function (settingsPageController, optionsLogger) {

	'use strict';
	
	function settingsChanged(updatedSettings) {
		app.updateSettings(updatedSettings);
	}

	optionsLogger();
	// app already loaded
	var app = chrome.extension.getBackgroundPage().require("app");
	settingsPageController.initialize(app.getSupportedServiceTypes());
	settingsPageController.on.settingsChanged.add(settingsChanged);
	settingsPageController.load(app.getSettings());
	
});
