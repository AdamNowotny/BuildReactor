define([
	'settings/app',
	'rx'
], function (app, Rx) {
	'use strict';

	var emptyGroupName = 'Projects';

	app.directive('projectList', function () {
		return {
			scope: {
				projects: '=',
				selectedView: '='
			},
			templateUrl: 'src/settings/directives/projectList/projectList.html',
			controller: function ($scope, $element, $attrs, $transclude) {
				$scope.groups = null;
				$scope.$watch('projects', function (projects) {
					projects.forEach(function (project) {
						project.group = project.group || emptyGroupName;
					});
					$scope.groups = projects.map(function (item) {
						return item.group;
					}).reduce(function (agg, group) {
						if (agg.indexOf(group) < 0) {
							agg.push(group);
						}
						return agg;
					}, []) || null;
				});
			}
		};
	});
});
