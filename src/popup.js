require.config({
	baseUrl: 'src',
	paths: {
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		jquery: "../components/jquery/jquery.min",
		mout: '../components/mout/src',
		'popup/messages': 'popup/messagesStatic',
		signals: '../components/js-signals/dist/signals',
		rx: 'rxjs',
		'rx.jquery': 'rxjs',
		'rx.time': 'rxjs',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore'
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
	'rxjs',
	'jquery',
	'popup/popupController',
	'bootstrap',
], function (rxjs, $, popupController) {

	'use strict';
	
	$('.navbar a').tooltip({ placement: 'bottom' });

});
