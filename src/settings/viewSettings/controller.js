define([
	'settings/app',
	'common-ui/core',
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

		$scope.$watch('config', function (config) {
			if (config.columns < 0) {
				config.columns = 0;
			}
			if (config.columns > 20) {
				config.columns = 20;
			}
		});

		$scope.setFixedWidth =  function (isFixed) {
			var changed = $scope.config.fullWidthGroups === isFixed;
			if (changed) {
				$scope.config.fullWidthGroups = !isFixed;
				core.setViews(angular.copy($scope.config));
			}
		};

	});
});