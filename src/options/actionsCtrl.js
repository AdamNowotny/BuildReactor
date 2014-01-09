define([
	'options/app',
	'options/stateService'
], function (app) {
	'use strict';

	app.controller('ActionsCtrl', function ($scope, StateService) {

		$scope.isActive = false;
		$scope.isEnabled = true;

		StateService.selectedServices.subscribe(function (current) {
			$scope.$apply(function () {
				if (current) {
					$scope.isActive = true;
					$scope.serviceName = current.name;
					$scope.isEnabled = !current.disabled;
				} else {
					$scope.isActive = false;
				}
			});
		});
	
		$scope.$watch('isEnabled', function (newValue, oldValue) {
			if (newValue === oldValue) {
				return;
			}
			if ($scope.isEnabled) {
				StateService.enableService();
			} else {
				StateService.disableService();
			}
		});

	});
});