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
				selected: null,
				allInView: []
			};
			$scope.views = {
				all: [],
				selected: null
			};
			$scope.projectsError = null;
			$scope.isLoading = false;
			$scope.isChanged = false;
		};

		reset();

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
					$scope.isChanged = true;
				});
			});
		};

		$scope.$watch('views.selected', function (viewName) {
			var getProjectById = function (id) {
				return Rx.Observable.fromArray($scope.projects.all)
					.where(function (item) {
						return item.id === id;
					});
			};

			if ($scope.views.all.length) {
				Rx.Observable.fromArray($scope.views.all)
					.where(function (view) {
						return view.name === viewName;
					}).selectMany(function (view) {
						return Rx.Observable.fromArray(view.items);
					}).selectMany(getProjectById)
					.toArray()
					.subscribe(function (projects) {
						$scope.projects.allInView = projects;
					});
			} else {
				$scope.projects.allInView = $scope.projects.all;
			}
		});

		$scope.save = function () {
			// TODO: save settings
			$scope.isChanged = false;
		};

		$scope.$on('dynamicForm.changed', function (event, updatedSettings) {
			settings = updatedSettings;
		});
	});
});