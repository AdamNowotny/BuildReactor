import 'angular-ui-bootstrap/src/modal/index-nocss';
import app from 'settings/app';
import core from 'common/core';

export default app.controller('RenameModalCtrl', ($scope, $uibModalInstance, serviceName) => {
	$scope.service = { name: serviceName };

	core.configurations.subscribe((configs) => {
		$scope.services = configs;
	});

	$scope.$watch('service.name', (name) => {
		$scope.exists = $scope.services ?
			$scope.services.filter((service) => service.name === name).length > 0 :
			false;
	});

	$scope.rename = function() {
		$uibModalInstance.close($scope.service.name);
	};
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});
