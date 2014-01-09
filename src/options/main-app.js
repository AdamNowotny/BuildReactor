define([
	'jquery',
	'options/optionsController',
	'common/core',
	'common/coreLogger',
	'angular',
	'options/app',
	'options/routes',
	'options/controller',
	'options/actionsCtrl',
	'options/serviceSettingsCtrl',
	'options/newServiceCtrl',
	'options/stateService'
], function ($, optionsController, core, logger, angular) {

	'use strict';

	logger();
	core.initOptions(function (response) {
		optionsController.initialize(response.serviceTypes);
		optionsController.load(response.settings);
	});

	angular.element(document).ready(function () {
		angular.bootstrap(document, ['options']);
	});

});
