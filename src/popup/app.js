define([
	'angular',
	'angular.route',
	'common-ui/directives/builds/builds'
], function (angular) {

	'use strict';

	return angular.module('popup', ['ngRoute', 'app.directives']);
});
