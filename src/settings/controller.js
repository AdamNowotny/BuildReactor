define([
	'settings/app',
	'common/core',
	'rx'
], function (app, core) {
	'use strict';

	app.controller('SettingsCtrl', function ($scope, $routeParams, $rootScope) {

		core.configurations.subscribe(function (configs) {
			$scope.$evalAsync(function () {
				$scope.services = configs;
				updateSelected();
			});
		});

		$scope.$on('$routeChangeSuccess', function (event, routeData) {
			$scope.serviceId = routeData.params.service;
			updateSelected();
		});

		var updateSelected = function () {
			if ($scope.services) {
				var selected = $scope.services.filter(function (service) {
					return service.name === $scope.serviceId;
				});
				$scope.selected = selected ? selected[0] : null;
			} else {
				$scope.selected = null;
			}
		};

	});
});