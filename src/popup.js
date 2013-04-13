require.config({
	baseUrl: 'src',
	paths: {
		'popup/messages': 'popup/messagesStatic',
		mout: '../components/mout/src',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: "../components/jquery/jquery",
		signals: '../components/js-signals/dist/signals',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		rx: '../components/rxjs/rx.min',
		'rx.time': '../components/rxjs/rx.time.min'
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
		bootstrap: [ 'jquery' ]
	}
});
require([
	'jquery',
	'popup/popupController',
	'bootstrap',
], function ($, popupController) {

	'use strict';
	
	$('.navbar a').tooltip({ placement: 'bottom' });

});
