define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.controller('AddServiceCtrl', function ($scope, $routeParams, $location) {
		$scope.selectedTypeId = $routeParams.serviceTypeId;

		$scope.$on('serviceNamePanel.added', function (event, serviceName) {
			$location.path('/new/' + $routeParams.serviceTypeId + '/' + serviceName);
			$location.search('serviceTypeId', null);
		});

		$scope.$on('thumbnails.selected', function (event, serviceTypeId) {
			$location.search('serviceTypeId', serviceTypeId).replace();
		});
	});
});