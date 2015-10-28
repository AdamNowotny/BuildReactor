define([
	'settings/app',
	'common-ui/core',
	'angular',
	'settings/configuration/directives/jsonEditor/jsonEditor'
], function (app, core, angular) {
	'use strict';

	app.controller('ConfigurationCtrl', function ($scope) {

		$scope.includePasswords = false;

		core.configurations.subscribe(function (config) {
			$scope.$evalAsync(function () {
				$scope.config = config;
				$scope.displayConfig = getDisplayConfig(config, $scope.includePasswords);
			});
		});

		$scope.$watch('includePasswords', function (includePasswords) {
			$scope.displayConfig = getDisplayConfig($scope.config, $scope.includePasswords);
		});

		$scope.$on('jsonEditor.changed', function (event, json) {
			$scope.saving = true;
			core.saveConfig(json);
 		});

		var getDisplayConfig = function (config, includePasswords) {
			if (!config) {
				return;
			}
			var displayConfig = angular.copy(config);
			if (!includePasswords) {
				displayConfig.forEach(function (serviceConfig) {
					delete serviceConfig.username;
					delete serviceConfig.password;
				});
			}
			return displayConfig;
		};
	});
});