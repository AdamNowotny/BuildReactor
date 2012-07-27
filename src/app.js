define([
		'serviceController',
		'notificationController',
		'badgeController',
		'settingsStore',
		'serviceTypesRepository',
		'loggingController'
	], function (serviceController, notificationController, badgeController, settingsStore, serviceTypesRepository, loggingController) {

		'use strict';

		loggingController();
		var settings = settingsStore.getAll();
		badgeController();
		notificationController.initialize();
		serviceController.load(settings);

		return {
			run: function () {
				serviceController.run();
			},
			getSettings: function () {
				return settingsStore.getAll();
			},
			updateSettings: function (newSettings) {
				settingsStore.store(newSettings);
				serviceController.load(newSettings);
				serviceController.run();
			},
			getSupportedServiceTypes: function () {
				return serviceTypesRepository;
			}
		};
	});
