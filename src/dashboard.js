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
	'dashboard/main'	
], function (rxjs, core, logger, angular, main) {

	'use strict';

	core.init();
	logger();
	
	angular.module('buildReactor', ['buildReactor.dashboard']);

	angular.element(document).ready(function () {
		angular.bootstrap(document, ['buildReactor']);
	});
});
