define([
	'common/resourceFinder',
	'main/settingsStore',
	'main/serviceRepository',
	'main/serviceController'
], function (resourceFinder, settingsStore, serviceRepository, serviceController) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'initOptions':
			sendResponse({
				settings: settingsStore.getAll(),
				serviceTypes: serviceRepository.getAll()
			});
			break;
		case 'updateSettings':
			settingsStore.store(request.settings);
			serviceController.load(request.settings).addOnce(function () {
				serviceController.run();
			});
			break;
		case 'serviceStateRequest':
			sendResponse({
				serviceState: serviceController.activeProjects()
			});
			break;
		case 'availableProjects':
			serviceRepository.create(request.serviceSettings).addOnce(function (service) {
				var result = service.projects(request.serviceSettings.projects);
				result.receivedProjects.addOnce(function (projects) {
					sendResponse({
						projects: projects
					});
				});
				result.errorThrown.addOnce(function (errorInfo) {
					sendResponse({
						error: errorInfo
					});
				});
			});
			return true;
		}
	}

	return function () {
		chrome.extension.onMessage.addListener(onMessage);
	};
});