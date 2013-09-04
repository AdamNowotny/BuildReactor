require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular.min',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		jquery: "../bower_components/jquery/jquery.min",
		mout: '../bower_components/mout/src',
		'popup/messages': 'popup/messagesStaticDashboard',
		rx: 'rxjs',
		'rx.binding': 'rxjs',
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
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		bootstrap: [ 'jquery' ]
	}
});
require([
	'rxjs',
	'popup/messages',
	'popup/popupLogger',
	'angular',
	'dashboard/main'	
], function (rxjs, messages, logger, angular, main) {

	'use strict';

	messages.init();
	logger();
	
	angular.module('buildReactor', ['buildReactor.dashboard']);

	angular.element(document).ready(function () {
		angular.bootstrap(document, ['buildReactor']);
	});
});
