define([
	'settings/app',
	'common/core',
	'rx'
], function (app, core) {
	'use strict';

	app.controller('SettingsCtrl', function ($scope, $routeParams) {

		$scope.$on('$routeChangeSuccess', function (event, routeData) {
			$scope.serviceId = routeData.params.service;
		});

		core.configurations.subscribe(function (configs) {
			$scope.$evalAsync(function () {
				$scope.services = configs;
			});
		});
	});
});