define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.directive('topnav', function ($modal) {
		return {
			scope: {
				service: '=service'
			},
			templateUrl: 'src/settings/directives/topnav/topnav.html',
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.$watch('service', function (selectedService) {
					console.log('new service for topnav', selectedService);
					if (selectedService) {
						$scope.isActive = true;
						$scope.isEnabled = !selectedService.disabled;
					} else {
						$scope.isActive = false;
					}
				});
			
				$scope.$watch('isEnabled', function (isEnabled) {
					if (isEnabled) {
						core.enableService($scope.service.name);
					} else {
						core.disableService($scope.service.name);
					}
				});

				$scope.remove = function () {
					$modal.open({
						templateUrl: 'src/settings/removeModal.html',
						controller: RemoveModalCtrl,
						scope: $scope,
						resolve: {
							serviceName: function () {
								return $scope.service.name;
							}
						}
					}).result.then(function (serviceName) {
						core.removeService(serviceName);
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
						templateUrl: 'src/settings/renameModal.html',
						controller: RenameModalCtrl,
						resolve: {
							serviceName: function () {
								return $scope.service.name;
							}
						}
					}).result.then(function (serviceName) {
						core.renameService($scope.service.name, serviceName);
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
