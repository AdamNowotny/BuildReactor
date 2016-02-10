import serviceSettingsView from 'settings/serviceSettingsView.html';

define([
	'settings/app'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider) {
		$routeProvider
		.when('/service/:serviceName', {
			template: serviceSettingsView,
			controller: 'ServiceSettingsCtrl',
			view: 'service'
		})
		.when('/new', {
			template: require('settings/addServiceView.html'),
			controller: 'AddServiceCtrl',
			reloadOnSearch: false,
			view: 'new'
		})
		.when('/new/:serviceTypeId/:serviceName', {
			template: serviceSettingsView,
			controller: 'ServiceSettingsCtrl',
			view: 'new'
		})
		.when('/view', {
			template: require('settings/viewSettings/view.html'),
			controller: 'ViewSettingsCtrl',
			view: 'view'
		})
		.when('/configuration', {
			template: require('settings/configuration/view.html'),
			controller: 'ConfigurationCtrl',
			view: 'configuration'
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
