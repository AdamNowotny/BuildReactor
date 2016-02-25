import 'angular-ui-bootstrap';

define([
	'settings/app',
	'common/core'
], function(app, core) {
	'use strict';

	app.controller('RenameModalCtrl', function($scope, $uibModalInstance, serviceName) {
		$scope.service = { name: serviceName };

		core.configurations.subscribe(function(configs) {
			$scope.services = configs;
		});

		$scope.$watch('service.name', function(name) {
			$scope.exists = $scope.services ? $scope.services.filter(function(service) {
				return service.name === name;
			}).length > 0 : false;
		});

		$scope.rename = function() {
			$uibModalInstance.close($scope.service.name);
		};
		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});
});
