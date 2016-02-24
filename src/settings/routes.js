import serviceSettingsView from 'settings/serviceSettingsView.html';
import addServiceView from 'settings/addServiceView.html';
import viewSettingsTemplate from 'settings/viewSettings/view.html';
import configurationTemplate from 'settings/configuration/view.html';

define([
	'settings/app'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider) {
		$routeProvider
		.when('/service/:serviceName', {
			templateUrl: serviceSettingsView,
			controller: 'ServiceSettingsCtrl',
			view: 'service'
		})
		.when('/new', {
			templateUrl: addServiceView,
			controller: 'AddServiceCtrl',
			reloadOnSearch: false,
			view: 'new'
		})
		.when('/new/:serviceTypeId/:serviceName', {
			templateUrl: serviceSettingsView,
			controller: 'ServiceSettingsCtrl',
			view: 'new'
		})
		.when('/view', {
			templateUrl: viewSettingsTemplate,
			controller: 'ViewSettingsCtrl',
			view: 'view'
		})
		.when('/configuration', {
			templateUrl: configurationTemplate,
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
