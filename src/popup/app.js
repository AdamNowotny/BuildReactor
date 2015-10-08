define([
	'angular',
	'angular.route',
	'angular.ui',
	'common-ui/directives/buildList/buildList'
], function (angular) {

	'use strict';

	return angular.module('popup', [
		'ngRoute',
		'template/tooltip/tooltip-popup.html',
		'ui.bootstrap.tooltip',
		'app.directives'
	]).config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
