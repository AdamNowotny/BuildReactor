define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('sidebar', function () {
		return {
			restrict: 'E',
			scope: {
				services: '=services'
			},
			templateUrl: 'src/settings/directives/sidebar/sidebar.html'
		};
	});
});
