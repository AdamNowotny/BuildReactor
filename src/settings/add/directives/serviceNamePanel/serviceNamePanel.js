import 'settings/add/directives/focusIf/focusIf';
import app from 'settings/app';
import core from 'common/core';
import template from 'settings/add/directives/serviceNamePanel/serviceNamePanel.html';

export default app.directive('serviceNamePanel', () => ({
		scope: {
			active: '='
		},
		templateUrl: template,
		controller($scope, $element, $attrs, $transclude) {
			$scope.serviceName = '';

			$scope.add = function() {
				$scope.$emit('serviceNamePanel.added', $scope.serviceName);
			};

			$scope.$watch('serviceName', (name) => {
				$scope.exists = $scope.services ?
				$scope.services.filter((service) => service.name === name).length > 0 :
				false;
			});

			core.configurations.subscribe((configs) => {
				$scope.services = configs;
			});

		}
}));
