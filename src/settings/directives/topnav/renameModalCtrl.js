define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.controller('RenameModalCtrl', function ($scope, $modalInstance, serviceName) {
		$scope.service = { name: serviceName };

		core.configurations.subscribe(function (configs) {
			$scope.services = configs;
		});

		$scope.$watch('service.name', function (name) {
			$scope.exists = $scope.services ? $scope.services.filter(function (service) {
				return service.name === name;
			}).length > 0 : false;
		});

		$scope.rename = function () {
			$modalInstance.close($scope.service.name);
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	});
});