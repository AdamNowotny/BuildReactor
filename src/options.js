require.config({
	baseUrl: 'src',
	paths: {
		bootbox: '../components/bootbox/bootbox.min',
		mout: '../components/mout/src',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: "../components/jquery/jquery",
		signals: '../components/js-signals/dist/signals',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons'
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		bootbox: {
			deps: [ 'bootstrap' ],
			exports: 'bootbox'
		},
		bootstrapToggle: {
			deps: [ 'jquery', 'bootstrap' ]
		}
	}
});
require([
	'options/optionsController',
	'options/optionsLogger'
], function (optionsController, optionsLogger) {

	'use strict';
	
	optionsLogger();
	chrome.extension.sendMessage({ name: "initOptions" }, function (response) {
		optionsController.initialize(response.serviceTypes);
		optionsController.load(response.settings);
	});
});
