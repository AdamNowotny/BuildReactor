import template from 'settings/directives/viewSelection/viewSelection.html';

define([
	'settings/app'
], function(app) {
	'use strict';

	app.directive('viewSelection', function() {
		return {
			scope: {
				views: '=',
				selected: '='
			},
			templateUrl: template
		};
	});
});
