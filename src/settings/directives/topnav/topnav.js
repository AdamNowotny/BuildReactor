define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('topnav', function () {
		return {
			templateUrl: 'src/settings/directives/topnav/topnav.html'
		};
	});
});
