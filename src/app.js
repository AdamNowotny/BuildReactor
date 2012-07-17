define([
		'serviceController',
		'notificationController',
		'settingsStore',
		'serviceTypesRepository',
		'amdUtils/string/interpolate'
	], function (serviceController, notificationController, settingsStore, serviceTypesRepository, interpolate) {

		'use strict';

		initializeLogging();
		var settings = settingsStore.getAll();
		notificationController.initialize();
		serviceController.load(settings);

		function initializeLogging() {
			window.onerror = function (message, url, line) {
				window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
				return false; // don't suppress default handling
			};
		}

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
