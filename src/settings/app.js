define([
	'angular',
	'angular.route',
	'angular.ui',
	'rx.angular'
], function (angular) {

	'use strict';

	return angular.module('settings', [
		'ngRoute',
		'ui.bootstrap',
		'rx'
	]);
});
