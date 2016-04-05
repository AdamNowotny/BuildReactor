import app from 'settings/app';
import core from 'common/core';

export default app.controller('ServiceSettingsCtrl', function($scope, $location) {

	var config;

	var reset = function() {
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
		$scope.filterQuery = '';
	};

	var getItemsForView = function(views, viewName) {
		var view = views.filter(function(view) {
			return view.name === viewName;
		});
		return view.length ? view[0].items : null;
	};

	var showError = function(errorResponse) {
		reset();
		$scope.projectsError = errorResponse;
	};
	
	var showProjects = function(projects) {
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
	
	$scope.show = function() {
		reset();
		$scope.isLoading = true;
		core.availableProjects(config, function(response) {
			$scope.$evalAsync(function() {
				$scope.isLoading = false;
				if (response.error) {
					showError(response.error);
				} else {
					showProjects(response.projects);
				}
			});
		});
	};

	$scope.$watch('views.selected', function(viewName) {
		$scope.views.selectedItems = getItemsForView($scope.views.all, viewName);
	});

	$scope.save = function() {
		core.saveService(config);
		$scope.saving = true;
		$scope.projects.selected = config.projects;
		$location.path('/service/' + config.name);
	};

	$scope.$on('dynamicForm.changed', function(event, updatedConfig) {
		config = updatedConfig;
	});

	$scope.$on('filterQuery.changed', function(event, query) {
		$scope.filterQuery = query;
	});

	$scope.$on('projectList.change', function(event, selectedProjects) {
		if (config) {
			config.projects = selectedProjects;
		}
	});

	reset();
});
