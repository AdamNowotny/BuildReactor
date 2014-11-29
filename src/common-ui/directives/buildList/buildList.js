define([
	'common-ui/directives/module',
	'common-ui/core',
	'common-ui/directives/service/service'
], function (module, core) {

	'use strict';

	module.directive('buildList', function () {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'src/common-ui/directives/buildList/buildList.html',
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.start = function () {
					$scope.services = [];
					core.activeProjects.subscribe(function (services) {
						$scope.$evalAsync(function () {
							$scope.services = services;
						});
					});
				};
			},
			link: function (scope, element, attrs, controller) {
				scope.start();
			}
		};
	});
});
