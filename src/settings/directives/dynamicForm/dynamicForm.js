define([
	'settings/app',
	'angular'
], function (app, angular) {
	'use strict';

	app.directive('dynamicForm', function () {
		return {
			scope: {
				service: '=',
				config: '='
			},
			template: require('settings/directives/dynamicForm/dynamicForm.html'),
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.isDefined = angular.isDefined;

				var addMissingProperties = function (defaultConfig, config) {
					for(var prop in defaultConfig) {
						if (defaultConfig.hasOwnProperty(prop) && !angular.isDefined(config[prop])) {
							config[prop] = defaultConfig[prop];
						}
					}
				};

				$scope.$watchCollection('config', function (config) {
					$scope.$emit('dynamicForm.changed', angular.copy(config));
				});

				$scope.$watch('service', function (service) {
					if (service && service.defaultConfig) {
						addMissingProperties(service.defaultConfig, $scope.config);
					}
				});
			}
		};
	});
});
