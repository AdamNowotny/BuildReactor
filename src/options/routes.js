define([
	'options/app'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/new', {
			templateUrl: 'src/options/newServiceView.html',
			controller: 'NewServiceCtrl'
		})
		.when('/:service', {
			templateUrl: 'src/options/serviceSettingsView.html',
			controller: 'ServiceSettingsCtrl'
		})
		.otherwise({
			redirectTo: '/new'
		});

		$locationProvider.html5Mode(false);
	}).config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
