import template from 'settings/directives/serviceNamePanel/serviceNamePanel.html';

define([
	'settings/app',
	'common/core'
], function(app, core) {
	'use strict';

	app.directive('serviceNamePanel', function() {
		return {
			scope: {
				active: '='
			},
			templateUrl: template,
			controller: function($scope, $element, $attrs, $transclude) {
				$scope.serviceName = '';
				
				$scope.add = function() {
					$scope.$emit('serviceNamePanel.added', $scope.serviceName);
				};

				$scope.$watch('serviceName', function(name) {
					$scope.exists = $scope.services ? $scope.services.filter(function(service) {
						return service.name === name;
					}).length > 0 : false;
				});

				core.configurations.subscribe(function(configs) {
					$scope.services = configs;
				});

			}
		};
	});
});
