define([
	'popup/app'
], function (app) {
	'use strict';

	return app.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'src/popup/view.html',
			controller: 'PopupCtrl'
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
