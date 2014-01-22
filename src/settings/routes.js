define([
	'settings/app'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider) {
		$routeProvider
		.when('/new', {
			templateUrl: 'src/settings/addServiceView.html',
			controller: 'AddServiceCtrl'
		})
		.when('/service/:service', {
			templateUrl: 'src/settings/serviceSettingsView.html',
			controller: 'ServiceSettingsCtrl'
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
