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

	var getVisibleProjectsForGroup = function (projects, groupName) {
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
			var groupProjects = getVisibleProjectsForGroup(projects, groupName);
			var selectedProjects = getSelectedProjects(groupProjects);
			return {
				name: groupName,
				projects: groupProjects,
				expanded: selectedProjects.length > 0 || groupNames.length === 1,
				visibleCount: groupProjects.length,
				projectsCount: groupProjects.length,
				allSelected: selectedProjects.length === groupProjects.length,
				someSelected: selectedProjects.length !== 0 && selectedProjects.length !== groupProjects.length,
				visible: groupProjects.length !== 0
			};
		});
	};

	var updateCheckAll = function (groups) {
		groups.forEach(function (group) {
			var selectedProjects = getSelectedProjects(group.projects);
			group.someSelected = selectedProjects.length !== 0 && selectedProjects.length !== group.projects.length;
			group.allSelected = selectedProjects.length === group.projects.length;
		});
	};

	app.directive('projectList', function ($sce, highlightFilter) {
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
					highlightNames($scope.projectList, $scope.filterQuery);
				});

				$scope.$watch('viewItems', function (viewItems) {
					$scope.projectList && $scope.projectList.forEach(function (project) {
						project.isInView = !viewItems || viewItems.indexOf(project.id) > -1;
					});
				});

				$scope.$watch('projectList', function (projects) {
					var selectedIds = getSelectedProjects(projects).map(function (project) {
						return project.id;
					});
					updateCheckAll($scope.groups);
					$scope.$emit('projectList.change', selectedIds);
				}, true);

				$scope.$watch('filterQuery', function (query) {
					$scope.groups && $scope.groups.forEach(function (group) {
						group.visibleCount = group.projects.filter(function (project) {
							return $scope.search(project);
						}).length;
					});
					highlightNames($scope.projectList, $scope.filterQuery);
				});

				$scope.search = function (project) {
					return project.name.toLowerCase().indexOf($scope.filterQuery.toLowerCase()) > -1;
				};

				$scope.checkAll = function (group) {
					group.projects.forEach(function (project) {
						project.isSelected = group.allSelected;
					});
				};

				var highlightNames = function (projects, highlightText) {
					projects.forEach(function (project) {
						var nameHtml = highlightFilter(project.name, highlightText);
						project.nameHtml = $sce.trustAsHtml(nameHtml);
					});
				};

			}
		};
	});
});
