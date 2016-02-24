import 'html5sortable/src/html.sortable.angular';
import template from 'settings/directives/selectedProjects/selectedProjects.html';

define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.directive('selectedProjects', function () {
		return {
			scope: {
				projects: '=',
				serviceName: '@'
			},
			templateUrl: template,
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.sortableCallback = function (startModel, destModel, start, end) {
					core.setBuildOrder($scope.serviceName, destModel);
				};
			}
		};
	});
});
