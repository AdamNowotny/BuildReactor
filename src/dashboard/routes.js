define([
	'dashboard/app'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'src/dashboard/view.html'
		})
		.otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(false);
	}).config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
