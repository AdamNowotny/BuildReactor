require.config({
	baseUrl: 'src',
	paths: {
		bootbox: '../bower_components/bootbox/bootbox.min',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		jquery: "../bower_components/jquery/jquery.min",
		mout: '../bower_components/mout/src',
		'options/messages': 'options/messagesStatic',
		rx: 'rxjs',
		'rx.jquery': 'rxjs',
		'rx.time': 'rxjs',
		signals: '../bower_components/js-signals/dist/signals',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore'
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
	'rxjs',
	'options/optionsController',
	'options/optionsLogger',
	'options/messages'
], function (rxjs, optionsController, optionsLogger, messages) {

	'use strict';

	optionsLogger();
	messages.initOptions(function (response) {
		optionsController.initialize(response.serviceTypes);
		optionsController.load(response.settings);
	});
});
