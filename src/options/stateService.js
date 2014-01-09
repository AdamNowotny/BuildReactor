define([
	'rx',
	'options/app',
	'options/optionsController',
	'common/core'
], function (Rx, app, optionsController, core) {
	'use strict';

	app.factory('StateService', function () {

		var selectedServices = new Rx.Subject();
		var currentService;
		var allServices;

		core.initOptions(function (response) {
			allServices = response.settings;
		});

		optionsController.currentServices.subscribe(function (service) {
			currentService = service;
			selectedServices.onNext(service);
		});

		var disableService = function () {
			core.disableService(currentService.name);
		};

		var enableService = function () {
			core.enableService(currentService.name);
		};

		return {
			selectedServices: selectedServices,
			disableService: disableService,
			enableService: enableService
		};
	});

});