define([
	'angular',
	'angular.route',
	'angular.ui',
	'angular.ui.utils',
	'htmlSortable'
], function (angular) {

	'use strict';

	return angular.module('settings', [
		'ngRoute',
		'ui.bootstrap',
		'ui.highlight',
		'ui.indeterminate',
		'htmlSortable',
		'app.directives'
	]);
});
