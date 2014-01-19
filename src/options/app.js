define([
	'angular',
	'angular.route',
	'angularBootstrapSwitch',
	'angular.ui'
], function (angular) {

	'use strict';

	return angular.module('options', [
		'ngRoute',
		'frapontillo.bootstrap-switch',
		'ui.bootstrap'
	]);
});
