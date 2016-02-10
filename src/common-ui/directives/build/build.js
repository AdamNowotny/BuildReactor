define([
	'common-ui/directives/module',
	'common-ui/core'
], function (module, core) {

	'use strict';

	module.directive('build', function ($interval) {
		return {
			restrict: 'E',
			scope: {
				build: '=buildInfo'
			},
			template: require('common-ui/directives/build/build.html'),
			controller: function ($scope, $element, $attrs, $transclude) {

				var commentChangeInterval = 7000;
				$scope.changeIndex = 0;

				var changesLength = $scope.build.changes ? $scope.build.changes.length : 0;
				if (changesLength > 1) {
					$interval(function () {
						$scope.changeIndex = ($scope.changeIndex + 1) % changesLength;
					}, commentChangeInterval);
				}

				$scope.getLabelClasses = function (tag) {
					var classes = tag.type ? 'label-' + tag.type : 'label-default';
						return classes;
				};

				core.views.subscribe(function (config) {
					$scope.$evalAsync(function () {
						$scope.viewConfig = config;
					});
				});

			}
		};
	});
});
