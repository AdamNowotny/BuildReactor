define([
	'options/app',
	'options/stateService'
], function (app) {
	'use strict';

	app.controller('ActionsCtrl', function ($scope, StateService) {

		var initializing;

		StateService.selectedServices.subscribe(function (current) {
			initializing = true;
			$scope.$apply(function () {
				if (current) {
					$scope.isActive = true;
					$scope.serviceName = current.name;
					$scope.isEnabled = !current.disabled;
				} else {
					$scope.isActive = false;
				}
			});
			initializing = false;
		});
	
		$scope.$watch('isEnabled', function (newValue, oldValue) {
			if (newValue === oldValue || initializing) {
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