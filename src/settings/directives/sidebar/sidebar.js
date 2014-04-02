define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('sidebar', function () {
		return {
			scope: {
				services: '=services',
				selected: '=selected',
				isNew: '=new'
			},
			templateUrl: 'src/settings/directives/sidebar/sidebar.html'
		};
	});
});
