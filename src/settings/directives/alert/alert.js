define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('brAlert', function ($timeout) {
		return {
			scope: {
				visible: '=show'
			},
			templateUrl: 'src/settings/directives/alert/alert.html',
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
