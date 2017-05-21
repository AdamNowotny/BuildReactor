import 'angular-ui-bootstrap/src/modal/index-nocss';
import app from 'settings/app';

export default app.controller('RemoveModalCtrl', ($scope, $uibModalInstance, serviceName) => {
	$scope.serviceName = serviceName;

	$scope.remove = function() {
		$uibModalInstance.close($scope.serviceName);
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});
