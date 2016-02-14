import 'htmlSortableJquery';
import 'htmlSortable';

define([
	'settings/app',
	'common/core',
	'htmlSortable'
], function (app, core) {
	'use strict';

	app.directive('selectedProjects', function ($location) {
		return {
			scope: {
				projects: '=',
				serviceName: '@'
			},
			template: require('settings/directives/selectedProjects/selectedProjects.html'),
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.sortableCallback = function (startModel, destModel, start, end) {
					core.setBuildOrder($scope.serviceName, destModel);
				};
			}
		};
	});
});
