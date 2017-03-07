import addServiceView from 'settings/add/view.html';
import app from 'settings/app';
import configurationTemplate from 'settings/configuration/view.html';
import serviceSettingsView from 'settings/service/view.html';
import viewSettingsTemplate from 'settings/view/view.html';

export default app.config(($routeProvider) => {
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
}).config(($locationProvider) => {
	$locationProvider.html5Mode(false);
}).config([
	'$compileProvider', function($compileProvider)	{
		$compileProvider
			.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|moz-extension):/)
			.imgSrcSanitizationWhitelist(/^\s*(chrome-extension|moz-extension):/);
	}
]);
