define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.directive('topnav', function ($modal, $location) {
		return {
			scope: {
				service: '=currentService',
				showActions: '='
			},
			templateUrl: 'src/settings/directives/topnav/topnav.html',
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
						templateUrl: 'src/settings/directives/topnav/removeModal.html',
						controller: RemoveModalCtrl,
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

				var RemoveModalCtrl = function ($scope, $modalInstance, serviceName) {
					$scope.serviceName = serviceName;
					$scope.remove = function () {
						$modalInstance.close($scope.serviceName);
					};
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				};

				$scope.rename = function () {
					$modal.open({
						templateUrl: 'src/settings/directives/topnav/renameModal.html',
						controller: RenameModalCtrl,
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

				var RenameModalCtrl = function ($scope, $modalInstance, serviceName) {
					$scope.service = { name: serviceName };
					$scope.rename = function () {
						$modalInstance.close($scope.service.name);
					};
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				};
			}
		};
	});
});
