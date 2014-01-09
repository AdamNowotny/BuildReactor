define([
	'options/app',
	'options/optionsController',
	'common/core',
	'rx'
], function (app, optionsController, core) {
	'use strict';

	app.controller('ServiceSettingsCtrl', function ($scope, $routeParams) {

		$scope.serviceId = $routeParams.service;
		
	});
});