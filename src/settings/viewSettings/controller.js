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
			if (config.columns < 0) {
				config.columns = 0;
			}
			if (config.columns > 20) {
				config.columns = 20;
			}
			core.setViews(angular.copy(config));
		};

		$scope.setFixedWidth =  function (isFixed) {
			var changed = $scope.config.fullWidthGroups === isFixed;
			if (changed) {
				$scope.config.fullWidthGroups = !isFixed;
				core.setViews(angular.copy($scope.config));
			}
		};

		$scope.setSingleGroupRows = function (onlyOne) {
			var changed = $scope.config.singleGroupRows !== onlyOne;
			if (changed) {
				$scope.config.singleGroupRows = onlyOne;
				core.setViews(angular.copy($scope.config));
			}
		};

		$scope.setShowCommits = function (show) {
			var changed = $scope.config.showCommits !== show;
			if (changed) {
				$scope.config.showCommits = show;
				core.setViews(angular.copy($scope.config));
			}
		};

		$scope.setTheme = function (theme) {
			var changed = $scope.config.theme !== theme;
			if(changed) {
				$scope.config.theme = theme;
				core.setViews(angular.copy($scope.config));
			}
		};

	});
});