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
	'options/stateService'
], function ($, optionsController, core, logger, angular) {

	'use strict';

	logger();
	core.init();
	core.availableServices(function (serviceTypes) {
		optionsController.initialize(serviceTypes);
		core.configurations.subscribe(function (config) {
			optionsController.load(config);
		});
	});

	angular.element(document).ready(function () {
		angular.bootstrap(document, ['options']);
	});

});
