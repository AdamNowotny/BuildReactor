define([
	'settings/app',
	'common/core',
	'angular',
	'common/directives/buildList/buildList'
], function (app, core, angular) {
	'use strict';

	app.controller('ViewSettingsCtrl', function ($scope) {

		core.views.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.viewConfig = config;
			});
		});

		core.activeProjects.subscribe(function (projects) {
			$scope.$evalAsync(function () {
				$scope.activeProjects = projects;
			});
		});

		$scope.save =  function (config) {
			if (config.columns < 0) {
				config.columns = 0;
			}
			if (config.columns > 20) {
				config.columns = 20;
			}
			core.setViews(angular.copy(config));
		};

		$scope.setField = function (name, value) {
			var changed = $scope.viewConfig[name] !== value;
			if (changed) {
				$scope.viewConfig[name] = value;
				core.setViews(angular.copy($scope.viewConfig));
			}
		};

		$scope.setTheme = function (theme) {
			var changed = $scope.viewConfig.theme !== theme;
			if(changed) {
				$scope.viewConfig.theme = theme;
				core.setViews(angular.copy($scope.viewConfig));
			}
		};

	});
});