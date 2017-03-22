import templateUrl from 'common/directives/buildList/buildList.html';

define([
	'common/directives/module',
	'common/core',
	'common/directives/service/service'
], function(module, core) {

	'use strict';

	module.directive('buildList', function() {
		return {
			restrict: 'E',
			scope: {},
			templateUrl,
			replace: true,
			controller($scope, $element, $attrs, $transclude) {

				$scope.start = function() {
					$scope.services = [];
					let rxActiveProjects = core.activeProjects.subscribe((services) => {
						$scope.$evalAsync(() => {
							$scope.services = services;
						});
					});

					$scope.$on("$destroy", () => {
						rxActiveProjects.dispose();
						rxActiveProjects = null;
					});

				};

			},
			link(scope, element, attrs, controller) {
				scope.start();
			}
		};
	});
});
