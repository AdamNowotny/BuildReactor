import angular from 'angular';
import app from 'settings/app';
import core from 'common/core';

export default app.controller('NotificationsCtrl', ($scope) => {
	core.views.subscribe((config) => {
		$scope.$evalAsync(() => {
			$scope.config = config;
		});
	});

	$scope.setField = function(name, value) {
		const changed = $scope.config.notifications[name] !== value;
		if (changed) {
			$scope.config.notifications[name] = value;
			core.setViews(angular.copy($scope.config));
		}
	};


});
