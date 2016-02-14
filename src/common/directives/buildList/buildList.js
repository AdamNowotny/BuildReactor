define([
	'common/directives/module',
	'common/core',
	'common/directives/service/service'
], function (module, core) {

	'use strict';

	module.directive('buildList', function () {
		return {
			restrict: 'E',
			scope: {},
			template: require('common/directives/buildList/buildList.html'),
			replace: true,
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
