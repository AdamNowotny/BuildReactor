define([
	'dashboard/app',
	'dashboard/controller'
], function (app, controller) {
	'use strict';

	return app.config(function ($routeProvider, $locationProvider) {
			$routeProvider
			.when('/dashboard.html', {
				templateUrl: 'src/dashboard/view.html',
				controller: 'DashboardCtrl'
			})
			.otherwise({
				redirectTo: '/dashboard.html'
			});

			$locationProvider.html5Mode(true);
		}); 
});
