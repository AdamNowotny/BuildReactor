define([
	'common-ui/directives/module',
	'common-ui/directives/build/build'
], function (module) {

	'use strict';

	module.directive('buildGroup', function () {
		return {
			scope: {
				name: '=',
				items: '='
			},
			templateUrl: 'src/common-ui/directives/buildGroup/buildGroup.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.getItemWidth = function (build) {
					// var width = 100 / $scope.items.length;
					// var width = 100 / 4;
					var width = 50;
					return width + '%';
				};


			}
		};
	});
});
