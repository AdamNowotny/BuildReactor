require.config({
	baseUrl: 'src',
	paths: {
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: '../lib/jquery/jquery',
		jqueryTools: '../lib/jquery-tools/jquery.tools.min',
		signals: '../lib/js-signals/signals',
		has: '../lib/requirejs/has'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		jqueryTools: [ 'jquery' ]
	}
});
require([
	'settingsPageController',
	'serviceTypesRepository',
	'optionsLogger'
], function (settingsPageController, serviceTypesRepository, optionsLogger) {

	'use strict';
	
	function onSettingsChanged(updatedSettings) {
		chrome.extension.sendMessage({name: "updateSettings", settings: updatedSettings});
	}

	optionsLogger();
	settingsPageController.on.settingsChanged.add(onSettingsChanged);
	settingsPageController.initialize(serviceTypesRepository);
	chrome.extension.sendMessage({name: "getSettings"}, function (response) {
		settingsPageController.load(response.settings);
	});
});
