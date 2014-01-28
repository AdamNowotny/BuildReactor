define([
	'settings/app',
	'common/core',
	'angular',
	'rx'
], function (app, core, angular) {
	'use strict';

	app.controller('ServiceSettingsCtrl', function ($scope, $routeParams) {

		var settings;

		$scope.isLoading = false;

		$scope.show = function () {
			$scope.projectsError = null;
			$scope.projects = null;
			$scope.isLoading = true;
			core.availableProjects(settings, function (response) {
				$scope.$evalAsync(function () {
					$scope.projects = response.projects;
					$scope.projectsError = response.error;
					$scope.isLoading = false;
				});
			});
		};

		$scope.save = function () {
			$scope.$emit('dynamicForm.saveClicked');
		};

		$scope.$on('dynamicForm.changed', function (event, updatedSettings) {
			settings = updatedSettings;
		});
	});
});