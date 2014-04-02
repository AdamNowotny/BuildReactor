define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('thumbnails', function () {
		return {
			scope: {
				serviceTypes: '=serviceTypes',
				selected: '=selected'
			},
			templateUrl: 'src/settings/directives/thumbnails/thumbnails.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.select = function (serviceTypeId) {
					$scope.selected = serviceTypeId;
					$scope.$emit('thumbnails.selected', serviceTypeId);
				};
			}
		};
	});
});
