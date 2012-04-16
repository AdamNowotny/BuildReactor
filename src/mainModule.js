define([
		'src/serviceController',
		'src/notificationController',
		'src/settingsStore',
		'amdUtils/string/interpolate'
	], function (serviceController, notificationController, settingsStore, interpolate) {

		initializeLogging();
		var settings = settingsStore.getAll();
		notificationController.initialize();
		serviceController.load(settings);

		function initializeLogging() {
			window.onerror = function (message, url, line) {
				console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
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
				return [
					{
						name: 'Atlassian Bamboo',
						icon: 'icon.png',
						baseUrl: 'src/bamboo',
						service: 'bambooBuildService',
						settingsController: 'bambooSettingsController',
						settingsPage: 'bambooOptions.html'
					}
				];
			}
		};
	});
