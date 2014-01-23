define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('thumbnails', function ($timeout) {
		return {
			scope: {
				serviceTypes: '=serviceTypes'
			},
			templateUrl: 'src/settings/directives/thumbnails/thumbnails.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.selectType = function (serviceTypeId) {
					$scope.selected = serviceTypeId;
					$scope.$emit('thumbnails.selected', serviceTypeId);
				};
			}
		};
	});
});
