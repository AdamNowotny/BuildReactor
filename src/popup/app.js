define([
	'angular',
	'angular.route',
	'angular.ui',
	'common-ui/directives/builds/builds'
], function (angular) {

	'use strict';

	return angular.module('popup', [
		'ngRoute',
		'template/tooltip/tooltip-popup.html',
		'ui.bootstrap.tooltip',
		'app.directives'
	]);
});
