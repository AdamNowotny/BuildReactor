define([
	'settings/app',
	'rx',
	'angular'
], function (app, Rx, angular) {
	'use strict';

	var getGroupNamesFromProjects = function (projects) {
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

	var getProjectsForGroup = function (projects, groupName) {
		return projects.filter(function (project) {
			return project.isInView && project.group === groupName;
		});
	};

	var getSelectedProjects = function (projects) {
		return projects.filter(function (project) {
			return project.isSelected;
		});
	};

	var createGroups = function (projects) {
		var groupNames = getGroupNamesFromProjects(projects);
		return groupNames.map(function (groupName) {
			var groupProjects = getProjectsForGroup(projects, groupName);
			return {
				name: groupName,
				projects: groupProjects,
				hasSelectedItems: getSelectedProjects(groupProjects).length > 0,
				visibleCount: groupProjects.length,
				projectsCount: groupProjects.length
			};
		});
	};

	app.directive('projectList', function () {
		return {
			scope: {
				projects: '=projects',
				selected: '=',
				viewItems: '=',
				filterQuery: '=filter'
			},
			templateUrl: 'src/settings/directives/projectList/projectList.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.groups = null;
				$scope.selected = [];

				$scope.$watch('projects', function (projects) {
					$scope.selected = $scope.selected || [];
					$scope.projectList = angular.copy($scope.projects);
					$scope.projectList.forEach(function (project) {
						project.isSelected = $scope.selected.indexOf(project.id) > -1;
						project.isInView = !$scope.viewItems || $scope.viewItems.indexOf(project.id) > -1;
					});
					$scope.groups = createGroups($scope.projectList);
				});

				$scope.$watch('viewItems', function (viewItems) {
					$scope.projectList && $scope.projectList.forEach(function (project) {
						project.isInView = !viewItems || viewItems.indexOf(project.id) > -1;
					});
				});

				$scope.$watch('projectList', function (projects) {
					console.log('projectList', projects);
					var selectedIds = getSelectedProjects(projects).map(function (project) {
						return project.id;
					});
					$scope.$emit('projectList.change', selectedIds);
				}, true);

				$scope.$watch('filterQuery', function (query) {
					console.log('query', query);
					$scope.groups && $scope.groups.forEach(function (group) {
						group.visibleCount = group.projects.filter(function (project) {
							return $scope.search(project);
						}).length;
					});
				});

				$scope.search = function (project) {
					return project.name.toLowerCase().indexOf($scope.filterQuery.toLowerCase()) > -1;
				};

				$scope.checkAll = function (group) {
					console.log('checkAll', group);
				};

			}
		};
	});
});
