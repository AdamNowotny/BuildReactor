require.config({
	baseUrl: 'src',
	paths: {
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: [ '../lib/jquery/jquery-1.8.2.min', '../lib/jquery/jquery-1.8.2'],
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
	
	optionsLogger();
	optionsController.on.settingsChanged.add(function (updatedSettings) {
		chrome.extension.sendMessage({name: "updateSettings", settings: updatedSettings});
	});
	chrome.extension.sendMessage({ name: "initOptions" }, function (response) {
		optionsController.initialize(response.serviceTypes);
		optionsController.load(response.settings);
	});
});
