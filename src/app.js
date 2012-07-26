define([
		'serviceController',
		'notificationController',
		'badgeController',
		'settingsStore',
		'serviceTypesRepository',
		'amdUtils/string/interpolate'
	], function (serviceController, notificationController, badgeController, settingsStore, serviceTypesRepository, interpolate) {

		'use strict';

		function initializeLogging() {
			window.onerror = function (message, url, line) {
				window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
				return false; // don't suppress default handling
			};
		}

		initializeLogging();
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
