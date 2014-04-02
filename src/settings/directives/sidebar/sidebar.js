define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('sidebar', function () {
		return {
			scope: {
				services: '=',
				selected: '=',
				isNew: '='
			},
			templateUrl: 'src/settings/directives/sidebar/sidebar.html'
		};
	});
});
