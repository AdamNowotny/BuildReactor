define([
	'settings/app',
	'rx',
	'angular'
], function (app, Rx, angular) {
	'use strict';

	var emptyGroupName = 'Projects';

	var getGroupsFromProjects = function (projects) {
		return projects.filter(function (project) {
				return project.isInView;
			}).map(function (item) {
				return item.group;
			}).reduce(function (agg, group) {
				if (agg.indexOf(group) < 0) {
					agg.push(group);
				}
				return agg;
			}, []) || null;
	};

	app.directive('projectList', function () {
		return {
			scope: {
				projects: '=',
				selected: '=',
				viewItems: '=',
				filterQuery: '=filter'
			},
			templateUrl: 'src/settings/directives/projectList/projectList.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.groups = null;
				$scope.selected = [];

				$scope.$watch('projects', function (projects) {
					$scope.projectList = angular.copy($scope.projects);
					$scope.selected = $scope.selected || [];
					$scope.projectList.forEach(function (project) {
						project.group = project.group || emptyGroupName;
						project.isSelected = $scope.selected.indexOf(project.id) > -1;
						project.isInView = !$scope.viewItems || $scope.viewItems.indexOf(project.id) > -1;
					});
					$scope.groups = getGroupsFromProjects($scope.projectList).map(function (groupName) {
						return {
							name: groupName,
							hasSelectedItems: true
						};
					});
				});

				$scope.$watch('viewItems', function (viewItems) {
					$scope.projectList.forEach(function (project) {
						project.isInView = !viewItems || viewItems.indexOf(project.id) > -1;
					});
				});

				$scope.$watch('projectList', function (projects) {
					var selectedProjects = projects.filter(function (project) {
						return project.isSelected;
					}).map(function (selectedProject) {
						return selectedProject.id;
					});
					$scope.$emit('projectList.change', selectedProjects);
				}, true);

				$scope.$watch('filterQuery', function (query) {
					console.log('query', query);
				});
			}
		};
	});
});
