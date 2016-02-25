import angular from 'angular';
import 'angular-route';
import 'angular-ui-bootstrap';

define([
	'common/directives/buildList/buildList'
], function() {

	'use strict';

	return angular.module('popup', [
		'ngRoute',
		'ui.bootstrap.tooltip',
		'uib/template/tooltip/tooltip-popup.html',
		'app.directives'
	]).config([
		'$compileProvider', function($compileProvider)	{
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
		}
	]);
});
