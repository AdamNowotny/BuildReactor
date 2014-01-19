define([
	'rx',
	'options/app',
	'options/optionsController',
	'common/core'
], function (Rx, app, optionsController, core) {
	'use strict';

	app.factory('StateService', function () {

		var selectedServices = new Rx.BehaviorSubject(null);
		var currentService;
		var allConfig;

		core.configurations.subscribe(function (config) {
			allConfig = config;
		});

		optionsController.currentServices.subscribe(function (service) {
			currentService = service;
			selectedServices.onNext(service);
		});

		var disableService = function () {
			if (currentService && !currentService.disabled) {
				core.disableService(currentService.name);
			}
		};

		var enableService = function () {
			if (currentService && currentService.disabled) {
				core.enableService(currentService.name);
			}
		};

		var removeService = function (serviceName) {
			core.removeService(serviceName);
		};

		return {
			selectedServices: selectedServices,
			disableService: disableService,
			enableService: enableService,
			removeService: removeService
		};
	});

});