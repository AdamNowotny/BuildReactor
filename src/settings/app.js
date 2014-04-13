define([
	'angular',
	'angular.route',
	'angular.ui',
	'angular.ui.highlight',
	'rx.angular'
], function (angular) {

	'use strict';

	return angular.module('settings', [
		'ngRoute',
		'ui.bootstrap',
		'ui.highlight',
		'rx'
	]);
});
