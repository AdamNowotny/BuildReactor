define([
	'settings/app'
], function (app) {
	'use strict';

	app.directive('viewSelection', function () {
		return {
			scope: {
				views: '=',
				selected: '='
			},
			templateUrl: 'src/settings/directives/viewSelection/viewSelection.html'
		};
	});
});
