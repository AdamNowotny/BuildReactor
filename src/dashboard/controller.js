import app from 'dashboard/app';
import core from 'common/core';

export default app.controller('DashboardCtrl', ($scope) => {
	core.views.subscribe((config) => {
		$scope.$evalAsync(() => {
			$scope.viewConfig = config;
		});
	});
});
