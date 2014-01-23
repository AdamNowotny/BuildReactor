define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('serviceNamePanel', function () {
		return {
			scope: {
				active: '=active'
			},
			templateUrl: 'src/settings/directives/serviceNamePanel/serviceNamePanel.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.serviceName = '';
				$scope.add = function () {
					$scope.$emit('serviceNamePanel.added', $scope.serviceName);
				};
			}
		};
	});
});
