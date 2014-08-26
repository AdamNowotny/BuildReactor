define([
	'settings/app',
	'common/core'
], function (app, core) {
	'use strict';

	app.directive('selectedProjects', function ($location) {
		return {
			scope: {
				projects: '='
			},
			templateUrl: 'src/settings/directives/selectedProjects/selectedProjects.html',
			controller: function ($scope, $element, $attrs, $transclude) {

			}
		};
	});
});
