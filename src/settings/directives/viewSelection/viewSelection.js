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
			template: require('settings/directives/viewSelection/viewSelection.html')
		};
	});
});
