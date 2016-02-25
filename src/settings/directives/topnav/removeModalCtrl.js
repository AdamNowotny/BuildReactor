import 'angular-ui-bootstrap';

define([
	'settings/app'
], function(app) {
	'use strict';

	app.controller('RemoveModalCtrl', function($scope, $uibModalInstance, serviceName) {
		$scope.serviceName = serviceName;

		$scope.remove = function() {
			$uibModalInstance.close($scope.serviceName);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});
});
