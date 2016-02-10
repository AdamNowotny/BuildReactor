import "bootstrap/dropdown";

define([
	'settings/app',
	'common-ui/core',
	'settings/directives/topnav/removeModalCtrl',
	'settings/directives/topnav/renameModalCtrl'
], function (app, core) {
	'use strict';

	app.directive('topnav', function ($modal, $location) {
		return {
			scope: {
				service: '=currentService',
				showActions: '='
			},
			template: require('settings/directives/topnav/topnav.html'),
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.$watch('service', function (selectedService) {
					if (selectedService) {
						$scope.isActive = $scope.showActions;
						$scope.isEnabled = !selectedService.disabled;
					} else {
						$scope.isActive = false;
					}
				});

				$scope.$on('onOffSwitch.change', function (event, isEnabled) {
					if (!$scope.service) {
						return;
					}
					if (isEnabled) {
						core.enableService($scope.service.name);
					} else {
						core.disableService($scope.service.name);
					}
				});

				$scope.remove = function () {
					$modal.open({
						template: require('settings/directives/topnav/removeModal.html'),
						controller: 'RemoveModalCtrl',
						scope: $scope,
						resolve: {
							serviceName: function () {
								return $scope.service.name;
							}
						}
					}).result.then(function (serviceName) {
						core.removeService(serviceName);
						$location.path('/new/').replace();
					});
				};

				$scope.rename = function () {
					$modal.open({
						template: require('settings/directives/topnav/renameModal.html'),
						controller: 'RenameModalCtrl',
						resolve: {
							serviceName: function () {
								return $scope.service.name;
							}
						}
					}).result.then(function (serviceName) {
						core.renameService($scope.service.name, serviceName);
						$location.path('/service/' + serviceName).replace();
					});
				};

			}
		};
	});
});
