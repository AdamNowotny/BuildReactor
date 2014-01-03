define([
	'angular',
	'angular.route',
	'common/directives/builds'
], function (angular) {

	'use strict';

	return angular.module('popup', ['ngRoute', 'app.directives']);
});
