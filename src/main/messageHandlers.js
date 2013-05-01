define([
	'main/settingsStore',
	'main/serviceLoader',
	'main/serviceController'
], function (settingsStore, serviceLoader, serviceController) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'initOptions':
			sendResponse({
				settings: settingsStore.getAll(),
				serviceTypes: serviceController.getAllTypes()
			});
			break;
		case 'updateSettings':
			settingsStore.store(request.settings);
			serviceController.start(request.settings).subscribe();
			break;
		case 'availableProjects':
			serviceLoader.load(request.serviceSettings).subscribe(function (service) {
				service.availableBuilds().subscribe(function (projects) {
					projects.selected = request.serviceSettings.projects;
					sendResponse({ projects: projects });
				}, function (error) {
					sendResponse({ error: error });
				});
			});
			return true;
		}
	}

	var stateSubscription;

	var onConnect = function (port) {
		stateSubscription = serviceController.currentState.subscribe(function (servicesState) {
			port.postMessage(servicesState);
		});
		port.onDisconnect.addListener(onDisconnect);
	};

	var onDisconnect = function (port) {
		stateSubscription.dispose();
	};

	return function () {
		chrome.runtime.onConnect.addListener(onConnect);
		chrome.runtime.onMessage.addListener(onMessage);
	};
});