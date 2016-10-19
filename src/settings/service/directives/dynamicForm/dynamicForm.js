import angular from 'angular';
import app from 'settings/app';
import template from 'settings/service/directives/dynamicForm/dynamicForm.html';

export default app.directive('dynamicForm', function() {
	return {
		scope: {
			service: '=',
			config: '='
		},
		templateUrl: template,
		controller: function($scope, $element, $attrs, $transclude) {
			$scope.isDefined = angular.isDefined;

			var addMissingProperties = function(defaultConfig, config) {
				for (var prop in defaultConfig) {
					if (defaultConfig.hasOwnProperty(prop) && !angular.isDefined(config[prop])) {
						config[prop] = defaultConfig[prop];
					}
				}
			};

			$scope.$watchCollection('config', function(config) {
				$scope.$emit('dynamicForm.changed', angular.copy(config));
			});

			$scope.$watch('service', function(service) {
				if (service && service.defaultConfig) {
					addMissingProperties(service.defaultConfig, $scope.config);
				}
			});
		}
	};
});
