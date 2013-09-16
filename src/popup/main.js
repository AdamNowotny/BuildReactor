define([
	'popup/app',
	'popup/controller'
], function (app, controller) {
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
			$compileProvider.urlSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
