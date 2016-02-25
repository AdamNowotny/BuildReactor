define([
	'settings/app',
	'common/core',
	'angular'
], function(app, core, angular) {
	'use strict';

	app.controller('SettingsCtrl', function($scope, $route) {

		$scope.serviceId = null;
		$scope.serviceTypeId = null;

		var update = function() {
			if ($scope.view === 'service') {
				updateForExistingService();
			} else if ($scope.view === 'new') {
				updateForNewService();
			}
		};

		var updateForExistingService = function() {
			if ($scope.serviceTypes && $scope.serviceConfigs && $scope.serviceId) {
				$scope.config = find($scope.serviceConfigs, 'name', $scope.serviceId);
				$scope.service = find($scope.serviceTypes, 'baseUrl', $scope.config.baseUrl);
			}
		};
		
		var updateForNewService = function() {
			if ($scope.serviceTypes && $scope.serviceId && $scope.serviceTypeId) {
				$scope.service = find($scope.serviceTypes, 'baseUrl', $scope.serviceTypeId);
				$scope.config = angular.copy($scope.service.defaultConfig);
				$scope.config.name = $scope.serviceId;
			} else {
				$scope.config = null;
				$scope.service = null;
			}
		};

		var find = function(list, field, value) {
			var item = list.filter(function(item) {
				return item[field] === value;
			})[0];
			return item ? item : null;
		};

		core.configurations.subscribe(function(configs) {
			$scope.$evalAsync(function() {
				$scope.serviceConfigs = configs;
				update();
			});
		});

		core.availableServices(function(types) {
			$scope.serviceTypes = types;
			update();
		});

		$scope.$on('$routeChangeSuccess', function(event, routeData) {
			$scope.serviceId = routeData.params.serviceName || null;
			$scope.serviceTypeId = routeData.params.serviceTypeId || null;
			$scope.view = $route.current.view;
			update();
		});

	});
});
