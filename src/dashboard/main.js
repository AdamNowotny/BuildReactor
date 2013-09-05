define([
	'dashboard/app',
	'dashboard/controller'
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
	}).config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider.urlSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
