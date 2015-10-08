define([
	'dashboard/app',
	'common-ui/core'
], function (app, core) {
	'use strict';

	app.controller('DashboardCtrl', function ($scope) {

		core.views.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.viewConfig = config;
			});
		});

	});
});
