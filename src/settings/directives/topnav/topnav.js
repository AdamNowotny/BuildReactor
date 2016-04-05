import "bootstrap/js/dropdown";
import 'angular-ui-bootstrap';
import 'settings/directives/topnav/removeModalCtrl';
import 'settings/directives/topnav/renameModalCtrl';
import app from 'settings/app';
import core from 'common/core';
import removeTemplate from 'settings/directives/topnav/removeModal.html';
import renameTemplate from 'settings/directives/topnav/renameModal.html';
import template from 'settings/directives/topnav/topnav.html';

export default app.directive('topnav', function($uibModal, $location) {
	return {
		scope: {
			service: '=currentService',
			showActions: '='
		},
		templateUrl: template,
		controller: function($scope, $element, $attrs, $transclude) {

			$scope.$watch('service', function(selectedService) {
				if (selectedService) {
					$scope.isActive = $scope.showActions;
					$scope.isEnabled = !selectedService.disabled;
				} else {
					$scope.isActive = false;
				}
			});

			$scope.$on('onOffSwitch.change', function(event, isEnabled) {
				if (!$scope.service) {
					return;
				}
				if (isEnabled) {
					core.enableService($scope.service.name);
				} else {
					core.disableService($scope.service.name);
				}
			});

			$scope.remove = function() {
				$uibModal.open({
					templateUrl: removeTemplate,
					controller: 'RemoveModalCtrl',
					scope: $scope,
					resolve: {
						serviceName: function() {
							return $scope.service.name;
						}
					}
				}).result.then(function(serviceName) {
					core.removeService(serviceName);
					$location.path('/new/').replace();
				});
			};

			$scope.rename = function() {
				$uibModal.open({
					templateUrl: renameTemplate,
					controller: 'RenameModalCtrl',
					resolve: {
						serviceName: function() {
							return $scope.service.name;
						}
					}
				}).result.then(function(serviceName) {
					core.renameService($scope.service.name, serviceName);
					$location.path('/service/' + serviceName).replace();
				});
			};

		}
	};
});
