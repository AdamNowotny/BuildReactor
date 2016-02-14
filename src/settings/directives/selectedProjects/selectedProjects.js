import 'html5sortable';

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
			template: require('settings/directives/selectedProjects/selectedProjects.html'),
			controller: function ($scope, $element, $attrs, $transclude) {

				$scope.sortableCallback = function (startModel, destModel, start, end) {
					core.setBuildOrder($scope.serviceName, destModel);
				};
			}
		};
	});
});
