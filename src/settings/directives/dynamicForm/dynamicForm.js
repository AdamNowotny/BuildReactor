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
			templateUrl: 'src/settings/directives/dynamicForm/dynamicForm.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.isDefined = angular.isDefined;

				$scope.$watchCollection('config', function (config) {
					$scope.$emit('dynamicForm.changed', angular.copy(config));
				});

			}
		};
	});
});
