require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular.min',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		jquery: "../bower_components/jquery/jquery.min",
		mout: '../bower_components/mout/src',
		'popup/messages': 'popup/messagesStatic',
		rx: 'rxjs',
		'rx.binding': 'rxjs',
		'rx.jquery': 'rxjs',
		'rx.time': 'rxjs'
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
	'popup/main'	
], function (rxjs, messages, logger, angular, main) {

	'use strict';

	messages.init();
	logger();
	
	angular.module('buildReactor', ['buildReactor.popup']);

	angular.element(document).ready(function () {
		angular.bootstrap(document, ['buildReactor']);
	});
});
