define([
	'settings/app'
], function (app) {
	'use strict';

	app.controller('RemoveModalCtrl', function ($scope, $modalInstance, serviceName) {
		$scope.serviceName = serviceName;

		$scope.remove = function () {
			$modalInstance.close($scope.serviceName);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	});
});