define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('sidebar', function () {
		return {
			scope: {
				services: '=services',
				selected: '=selected'
			},
			templateUrl: 'src/settings/directives/sidebar/sidebar.html'
		};
	});
});
