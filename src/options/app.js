define([
	'angular',
	'angular.route',
	'angularBootstrapSwitch',
	'angular.ui',
	'rx.angular'
], function (angular) {

	'use strict';

	return angular.module('options', [
		'ngRoute',
		'frapontillo.bootstrap-switch',
		'ui.bootstrap',
		'rx'
	]);
});
