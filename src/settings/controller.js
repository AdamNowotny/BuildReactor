define([
	'settings/app',
	'common/core',
	'rx'
], function (app, core) {
	'use strict';

	app.controller('SettingsCtrl', function ($scope, $routeParams) {

		$scope.serviceId = $routeParams.service;

		core.configurations.subscribe(function (configs) {
			$scope.$evalAsync(function () {
				$scope.services = configs;
			});
		});
	});
});