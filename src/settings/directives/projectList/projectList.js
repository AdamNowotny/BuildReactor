define([
	'settings/app',
	'rx'
], function (app, Rx) {
	'use strict';

	var emptyGroupName = 'Projects';

	var getGroupsFromProjects = function (projects) {
		return projects.map(function (item) {
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
				selected: '='
			},
			templateUrl: 'src/settings/directives/projectList/projectList.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.groups = null;
				$scope.selected = [];
				$scope.$watch('projects', function (projects) {
					$scope.selected = $scope.selected || [];
					projects.forEach(function (project) {
						project.group = project.group || emptyGroupName;
						project.isSelected = $scope.selected.indexOf(project.id) > -1;
					});
					$scope.groups = getGroupsFromProjects(projects);
				});
			}
		};
	});
});
