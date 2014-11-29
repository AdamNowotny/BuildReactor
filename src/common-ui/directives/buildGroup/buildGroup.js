define([
	'common-ui/directives/module',
	'common-ui/core',
	'common-ui/directives/build/build'
], function (module, core) {

	'use strict';

	module.directive('buildGroup', function () {
		return {
			restrict: 'E',
			scope: {
				name: '=',
				items: '='
			},
			templateUrl: 'src/common-ui/directives/buildGroup/buildGroup.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.getItemWidth = function (build) {
					return $scope.viewConfig ?
						getWidth(build, $scope.viewConfig) :
						'100%';
				};

				var getWidth = function (build, config) {
					var width;
					if (config.fullWidthGroups) {
						var items = $scope.items.length;
						width = 100 / Math.min(items, config.columns);
					} else {
						width = 100 / config.columns;
					}
					return width + '%';
				};

				core.views.subscribe(function (configs) {
					$scope.$evalAsync(function () {
						$scope.viewConfig = configs;
					});
				});

			}
		};
	});
});
