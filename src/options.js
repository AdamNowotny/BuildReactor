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
	'optionsController',
	'optionsLogger'
], function (optionsController, optionsLogger) {

	'use strict';
	
	function onSettingsChanged(updatedSettings) {
		chrome.extension.sendMessage({name: "updateSettings", settings: updatedSettings});
	}

	optionsLogger();
	optionsController.on.settingsChanged.add(onSettingsChanged);
	optionsController.initialize();
	chrome.extension.sendMessage({name: "getSettings"}, function (response) {
		optionsController.load(response.settings);
	});
});
