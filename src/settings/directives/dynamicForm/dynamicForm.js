define([
	'settings/app',
	'angular'
], function (app, angular) {
	'use strict';

	app.directive('dynamicForm', function () {
		return {
			scope: {
				service: '='
			},
			templateUrl: 'src/settings/directives/dynamicForm/dynamicForm.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.isDefined = angular.isDefined;

				$scope.$watchCollection('service', function (service) {
					$scope.$emit('dynamicForm.changed', angular.copy(service));
				});

			}
		};
	});
});
