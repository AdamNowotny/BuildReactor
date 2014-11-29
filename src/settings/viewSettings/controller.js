define([
	'settings/app',
	'common/core',
	'angular',
	'common-ui/directives/buildList/buildList'
], function (app, core, angular) {
	'use strict';

	app.controller('ViewSettingsCtrl', function ($scope) {

		core.views.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.config = config;
			});
		});

		core.activeProjects.subscribe(function (projects) {
			$scope.$evalAsync(function () {
				$scope.services = projects;
			});
		});

		$scope.save =  function (config) {
			core.setViews(angular.copy(config));
		};

		$scope.setFixedWidth =  function (isFixed) {
			var changed = $scope.config.fullWidthGroups === isFixed;
			if (changed) {
				$scope.config.fullWidthGroups = !isFixed;
				core.setViews(angular.copy($scope.config));
			}
		};

	});
});