define([
	'settings/app',
	'common-ui/core'
], function (app, core) {
	'use strict';

	app.directive('serviceNamePanel', function () {
		return {
			scope: {
				active: '='
			},
			template: require('settings/directives/serviceNamePanel/serviceNamePanel.html'),
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.serviceName = '';
				
				$scope.add = function () {
					$scope.$emit('serviceNamePanel.added', $scope.serviceName);
				};

				$scope.$watch('serviceName', function (name) {
					$scope.exists = $scope.services ? $scope.services.filter(function (service) {
						return service.name === name;
					}).length > 0 : false;
				});

				core.configurations.subscribe(function (configs) {
					$scope.services = configs;
				});

			}
		};
	});
});
