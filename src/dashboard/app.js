define([
	'angular',
	'angular.route',
	'directives/builds'
], function (angular) {

	'use strict';

	return angular.module('dashboard', ['ngRoute', 'app.directives']);
});
