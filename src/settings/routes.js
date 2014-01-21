define([
	'settings/app',
	'settings/serviceSettingsCtrl',
	'settings/newServiceCtrl'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider) {
		$routeProvider
		.when('/new', {
			templateUrl: 'src/settings/newServiceView.html',
			controller: 'NewServiceCtrl'
		})
		.when('/service/:service', {
			templateUrl: 'src/settings/serviceSettingsView.html',
			controller: 'ServiceSettingsCtrl'
		})
		.otherwise({
			redirectTo: '/new'
		});
	}).config(function ($locationProvider) {
		$locationProvider.html5Mode(false);
	}).config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider
				.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/)
				.imgSrcSanitizationWhitelist(/^\s*(chrome-extension):/);

		}
	]);
});
