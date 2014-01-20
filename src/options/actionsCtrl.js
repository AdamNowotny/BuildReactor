define([
	'options/app',
	'rx',
	'options/stateService',
	'rx.angular'
], function (app, Rx) {
	'use strict';

	app.controller('ActionsCtrl', function ($scope, StateService, $modal, $timeout, observeOnScope) {

		StateService.selectedServices.subscribe(function (current) {
			$timeout(function () {
				if (current) {
					$scope.isActive = true;
					$scope.serviceName = current.name;
					$scope.isEnabled = !current.disabled;
				} else {
					$scope.isActive = false;
				}
			});
		});
	
		observeOnScope($scope, 'isEnabled').subscribe(function (change) {
			if (change.newValue) {
				StateService.enableService();
			} else {
				StateService.disableService();
			}
		});

		$scope.remove = function () {
			var modalInstance = $modal.open({
				templateUrl: 'src/options/removeModal.html',
				controller: RemoveModalCtrl,
				scope: $scope,
				resolve: {
					serviceName: function () {
						return $scope.serviceName;
					}
				}
			});

			modalInstance.result.then(function (serviceName) {
				StateService.removeService(serviceName);
			});
		};

		var RemoveModalCtrl = function ($scope, $modalInstance) {
			$scope.remove = function () {
				$modalInstance.close($scope.serviceName);
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		};

	});
});