define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.controller('NewServiceCtrl', function ($scope, $timeout) {

		core.availableServices(function (serviceTypes) {
			$timeout(function () {
				$scope.serviceTypes = serviceTypes;
			});
		});

		$scope.$on('thumbnails.selected', function (event, data) {
			var selected = $scope.serviceTypes.filter(function (serviceType) {
				return serviceType.baseUrl === data;
			});
			$scope.selected = selected ? selected[0] : null;
		});

		$scope.$watch('selected', function (serviceType) {
			console.log('selected: ', serviceType);
		});

	});
});