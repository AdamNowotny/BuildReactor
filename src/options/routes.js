define([
	'options/app'
], function (app) {
	'use strict';

	return app.config(function ($locationProvider) {
		$locationProvider.html5Mode(false);
	}).config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
