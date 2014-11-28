define([
	'settings/app'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider) {
		$routeProvider
		.when('/service/:serviceName', {
			templateUrl: 'src/settings/serviceSettingsView.html',
			controller: 'ServiceSettingsCtrl',
			view: 'service'
		})
		.when('/new', {
			templateUrl: 'src/settings/addServiceView.html',
			controller: 'AddServiceCtrl',
			reloadOnSearch: false,
			view: 'new'
		})
		.when('/new/:serviceTypeId/:serviceName', {
			templateUrl: 'src/settings/serviceSettingsView.html',
			controller: 'ServiceSettingsCtrl',
			view: 'new'
		})
		.when('/view', {
			templateUrl: 'src/settings/viewSettings/view.html',
			controller: 'ViewSettingsCtrl',
			view: 'view'
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
