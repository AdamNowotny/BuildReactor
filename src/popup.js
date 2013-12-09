require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular.min',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		'common/core': 'common/core.mock',
		jquery: "../bower_components/jquery/jquery.min",
		mout: '../bower_components/mout/src',
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
	'common/core',
	'common/coreLogger',
	'angular',
	'popup/main'
], function (rxjs, core, logger, angular, main) {

	'use strict';

	core.init();
	logger();
	
	var app = angular.module('buildReactor', ['buildReactor.popup']);
	app.config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider.urlSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['buildReactor']);
	});
});
