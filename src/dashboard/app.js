define([
	'angular',
	'angular.route',
	'common/directives/builds'
], function (angular) {

	'use strict';

	return angular.module('dashboard', ['ngRoute', 'app.directives']);
});
