define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('brAlert', function ($timeout) {
		return {
			scope: {
				visible: '=show'
			},
			template: require('settings/directives/alert/alert.html'),
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.$watch('visible', function (value) {
					if (value === true) {
						$timeout(function () {
							$scope.visible = false;
						}, 3000);
					}
				});
			}
		};
	});
});
