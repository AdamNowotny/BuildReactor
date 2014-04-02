define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('sidebar', function () {
		return {
			scope: {
				services: '=',
				selected: '=',
				isNew: '=new'
			},
			templateUrl: 'src/settings/directives/sidebar/sidebar.html'
		};
	});
});
