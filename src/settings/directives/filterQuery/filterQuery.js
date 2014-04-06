define([
	'settings/app',
	'rx',
	'angular'
], function (app, Rx, angular) {
	'use strict';

	var KEY_ESC = 27;

	app.directive('filterQuery', function () {
		return {
			scope: { },
			templateUrl: 'src/settings/directives/filterQuery/filterQuery.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.query = '';

				$scope.keyDown = function (event) {
					if (event.keyCode === KEY_ESC) {
						$scope.query = '';
					}
				};
				
				$scope.$watch('query', function (query) {
					$scope.$emit('filterQuery.changed', query);
				});
			}
		};
	});
});
