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

		var showError = function (errorResponse) {
			reset();
			$scope.projectsError = errorResponse;
		};
		
		var showProjects = function (projects) {
			$scope.projectsError = null;
			$scope.projects = {
				all: projects.items,
				selected: projects.selected
			};
			$scope.views = {
				all: projects.views || [],
				selected: projects.primaryView
			};
		};
		
		$scope.show = function () {
			reset();
			$scope.isLoading = true;
			core.availableProjects(settings, function (response) {
				$scope.$evalAsync(function () {
					$scope.isLoading = false;
					if (response.error) {
						showError(response.error);
					} else {
						showProjects(response.projects);
					}
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
			$scope.projects.selected = settings.projects;
		};

		$scope.$on('dynamicForm.changed', function (event, updatedSettings) {
			settings = updatedSettings;
		});

		$scope.$on('projectList.change', function (event, selectedProjects) {
			if (settings) {
				settings.projects = selectedProjects;
			}
			$scope.isChanged = $scope.projects.selected &&
				!angular.equals($scope.projects.selected, selectedProjects);
		});

		$scope.$watch('selected', function (selectedService) {
			$scope.selectedDraft = angular.copy($scope.selected);
		});
		
		reset();
	});
});