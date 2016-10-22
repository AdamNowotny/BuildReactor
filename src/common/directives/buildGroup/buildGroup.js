import 'common/directives/build/build';
import templateUrl from 'common/directives/buildGroup/buildGroup.html';

define([
	'common/directives/module',
	'common/core'
], function(module, core) {

	'use strict';

	module.directive('buildGroup', function() {
		return {
			restrict: 'E',
			scope: {
				name: '=',
				items: '='
			},
			templateUrl: templateUrl,
			controller: function($scope, $element, $attrs, $transclude) {

				$scope.fullWidth = '100%';
				$scope.itemWidth = '100%';

				$scope.$watch('viewConfig', function(config) {
					if (config && $scope.items) {
						$scope.fullWidth = calculateFullWidth(config, $scope.items);
						$scope.itemWidth = calculateWidth(config, $scope.items);
						$scope.isNewRow = calculateIsNewRow(config, $scope.items);
					}
				});

				var calculateWidth = function(config, items) {
					var width = 100 / Math.min(items.length, config.columns);
					return width + '%';
				};

				var calculateFullWidth = function(config, items) {
					if (config.fullWidthGroups) {
						return '100%';
					}
					var columnWidth = 100 / config.columns;
					var allColumnsWidth = columnWidth * Math.min(items.length, config.columns);
					return allColumnsWidth + '%';
				};

				var calculateIsNewRow = function(config, items) {
					return config.fullWidthGroups || items.length < config.columns;
				};

				core.views.subscribe(function(config) {
					$scope.$evalAsync(function() {
						$scope.viewConfig = config;
					});
				});

			}
		};
	});
});
