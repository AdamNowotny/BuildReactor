import template from 'settings/directives/thumbnails/thumbnails.html';

define([
	'settings/app'
], function(app) {
	'use strict';

	app.directive('thumbnails', function() {
		return {
			scope: {
				serviceTypes: '=',
				selected: '='
			},
			templateUrl: template,
			controller: function($scope, $element, $attrs, $transclude) {
				$scope.select = function(serviceTypeId) {
					$scope.selected = serviceTypeId;
					$scope.$emit('thumbnails.selected', serviceTypeId);
				};
			}
		};
	});
});
