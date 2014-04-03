define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.controller('SettingsCtrl', function ($scope, $route) {

		$scope.serviceId = null;
		$scope.serviceTypeId = null;
		$scope.selected = null;
		
		core.configurations.subscribe(function (configs) {
			$scope.$evalAsync(function () {
				$scope.services = configs;
				updateSelected();
			});
		});

		core.availableServices(function (types) {
			$scope.serviceTypes = types;
			updateSelected();
		});

		$scope.$on('$routeChangeSuccess', function (event, routeData) {
			$scope.serviceId = routeData.params.serviceName || null;
			$scope.serviceTypeId = routeData.params.serviceTypeId || null;
			$scope.isNew = $route.current.isNew;
			updateSelected();
		});

		var updateSelected = function () {
			$scope.isNew ? updateSelectedForNew() : updateSelectedForService();
		};

		var updateSelectedForService = function () {
			if ($scope.services && $scope.serviceId) {
				$scope.selected = $scope.services.filter(function (service) {
					return service.name === $scope.serviceId;
				})[0];
			} else {
				$scope.selected = null;
			}
		};

		var updateSelectedForNew = function () {
			if ($scope.serviceTypes && $scope.serviceTypeId) {
				$scope.selected = $scope.serviceTypes.filter(function (type) {
					return type.baseUrl === $scope.serviceTypeId;
				})[0];
				$scope.selected.name = $scope.serviceId;
			} else {
				$scope.selected = null;
			}
		};

	});
});