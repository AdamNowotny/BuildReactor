import 'settings/add/directives/serviceNamePanel/serviceNamePanel';
import 'settings/add/directives/thumbnails/thumbnails';
import app from 'settings/app';

export default app.controller('AddServiceCtrl', ($scope, $routeParams, $location) => {
	$scope.selectedTypeId = $routeParams.serviceTypeId;

	$scope.$on('serviceNamePanel.added', (event, serviceName) => {
		$location.path(`/new/${$routeParams.serviceTypeId}/${serviceName}`);
		$location.search('serviceTypeId', null);
	});

	$scope.$on('thumbnails.selected', (event, serviceTypeId) => {
		$location.search('serviceTypeId', serviceTypeId).replace();
	});
});
