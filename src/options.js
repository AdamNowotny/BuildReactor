require.config({
	baseUrl: 'src',
	paths: {
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: '../lib/jquery/jquery',
		jqueryTools: '../lib/jquery-tools/jquery.tools.min',
		signals: '../lib/js-signals/signals',
		has: '../lib/requirejs/has',
		urljs: '../lib/urljs/url-min'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		jqueryTools: [ 'jquery' ],
		urljs: { exports: 'URL' }
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
