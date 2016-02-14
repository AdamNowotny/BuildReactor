import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';

define([
	'common/directives/buildList/buildList'
], function () {

	'use strict';

	return angular.module('dashboard', [
		'ngRoute',
		'uib/template/tooltip/tooltip-popup.html',
		'ui.bootstrap.tooltip',
		'app.directives'
	]).config([
		'$compileProvider', function ($compileProvider)	{
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
