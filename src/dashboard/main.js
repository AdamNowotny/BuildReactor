define([
	'dashboard/app',
	'dashboard/controller',
	'directives/builds'
], function (app, controller) {
	'use strict';

	return app.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'src/dashboard/view.html',
			controller: 'DashboardCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(false);
	});
});
