define([
	'settings/app',
	'common/core',
	'angular',
	'rx'
], function (app, core, angular, Rx) {
	'use strict';

	app.controller('ServiceSettingsCtrl', function ($scope, $routeParams) {

		var settings;

		var reset = function () {
			$scope.projects = {
				all: [],
				selected: null
			};
			$scope.views = {
				all: [],
				selected: null,
				selectedItems: null
			};
			$scope.projectsError = null;
			$scope.isLoading = false;
			$scope.isChanged = false;
		};

		var getItemsForView = function (views, viewName) {
			var view = views.filter(function (view) {
				return view.name === viewName;
			});
			return view.length ? view[0].items : null;
		};

		$scope.show = function () {
			reset();
			$scope.isLoading = true;
			core.availableProjects(settings, function (response) {
				$scope.$evalAsync(function () {
					$scope.projects = {
						all: response.projects.items,
						selected: response.projects.selected
					};
					$scope.views = {
						all: response.projects.views || [],
						selected: response.projects.primaryView
					};
					$scope.projectsError = response.error;
					$scope.isLoading = false;
				});
			});
		};

		$scope.$watch('views.selected', function (viewName) {
			$scope.views.selectedItems = getItemsForView($scope.views.all, viewName);
		});

		$scope.save = function () {
			core.updateService(settings);
			$scope.saving = true;
			$scope.isChanged = false;
		};

		$scope.$on('dynamicForm.changed', function (event, updatedSettings) {
			settings = updatedSettings;
		});

		$scope.$on('projectList.change', function (event, selectedProjects) {
			settings.projects = selectedProjects;
			$scope.isChanged = $scope.projects.selected !== null &&
				!angular.equals($scope.projects.selected, selectedProjects);
		});

		reset();
		$scope.selectedDraft = angular.copy($scope.selected);
	});
});