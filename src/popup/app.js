define([
	'angular',
	'angular.route',
	'directives/builds'
], function (angular) {

	'use strict';

	return angular.module('popup', ['ngRoute', 'app.directives']);
});
