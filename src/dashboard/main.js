require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular.min',
		'angular.route': '../bower_components/angular-route/angular-route.min',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		'common/core': 'common/core.mock',
		jquery: "../bower_components/jquery/jquery.min",
		mout: '../bower_components/mout/src',
		rx: '../bower_components/rxjs/rx',
		'rx.binding': '../bower_components/rxjs/rx.binding',
		'rx.time': '../bower_components/rxjs/rx.time'
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		bootstrap: [ 'jquery' ],
		'angular.route': [ 'angular' ]
	}
});

require([
	'common/core',
	'common/coreLogger',
	'angular',
	'dashboard/app',
	'dashboard/routes',
	'dashboard/controller'
], function (core, logger, angular) {

	'use strict';

	core.init();
	logger();
	
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['dashboard']);
	});
});
