define([
	'settings/app',
	'common/core',
	'angular'
], function (app, core, angular) {
	'use strict';

	app.controller('ViewSettingsCtrl', function ($scope, $routeParams) {

		core.views.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.config = config;
			});
		});

		$scope.save =  function (config) {
			core.setViews(angular.copy(config));
		};

	});
});