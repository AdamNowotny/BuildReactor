import 'settings/service/controller';
import 'settings/add/controller';
import 'settings/notifications/controller';
import 'settings/view/controller';
import 'settings/configuration/controller';
import 'settings/directives/sidebar/sidebar';
import 'settings/directives/topnav/topnav';
import angular from 'angular';
import app from 'settings/app';
import core from 'common/core';
import serviceMonitor from 'services/service-monitor';

export default app.controller('SettingsCtrl', ($scope, $route) => {
	$scope.serviceId = null;
	$scope.serviceTypeId = null;

	const update = function() {
		if ($scope.view === 'service') {
			updateForExistingService();
		} else if ($scope.view === 'new') {
			updateForNewService();
		}
	};

	const updateForExistingService = function() {
		if ($scope.serviceTypes && $scope.serviceConfigs && $scope.serviceId) {
			$scope.config = find($scope.serviceConfigs, 'name', $scope.serviceId) || {};
			$scope.service = find($scope.serviceTypes, 'baseUrl', $scope.config.baseUrl);
		}
	};

	const updateForNewService = function() {
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

	$scope.serviceTypes = serviceMonitor.getTypes();

	$scope.$on('$routeChangeSuccess', function(event, routeData) {
		$scope.serviceId = routeData.params.serviceName || null;
		$scope.serviceTypeId = routeData.params.serviceTypeId || null;
		$scope.view = $route.current.view;
		update();
	});

});
