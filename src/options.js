require.config({
	baseUrl: 'src',
	paths: {
		'options/messages': 'options/messagesStatic',
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
		bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
		rx: '../components/rxjs/rx.modern',
		'rx.jquery': '../components/rxjs-jquery/rx.jquery',
		'rx.time': '../components/rxjs/rx.time'
	},
	map: {
		'rx.jquery': {
			'jQuery': 'jquery'
		}
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
	'options/optionsLogger',
	'options/messages'
], function (optionsController, optionsLogger, messages) {

	'use strict';
	
	optionsLogger();
	messages.send({ name: "initOptions" }, function (response) {
		optionsController.initialize(response.serviceTypes);
		optionsController.load(response.settings);
	});
});
