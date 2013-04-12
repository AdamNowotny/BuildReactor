define([
	'main/settingsStore',
	'main/serviceRepository',
	'main/serviceController'
], function (settingsStore, serviceRepository, serviceController) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'initOptions':
			sendResponse({
				settings: settingsStore.getAll(),
				serviceTypes: serviceRepository.getAllTypes()
			});
			break;
		case 'updateSettings':
			settingsStore.store(request.settings);
			serviceController.load(request.settings).addOnce(function () {
				serviceController.run();
			});
			break;
		case 'activeProjects':
			sendResponse({
				serviceState: serviceController.activeProjects()
			});
			break;
		case 'availableProjects':
			serviceRepository.create(request.serviceSettings).addOnce(function (service) {
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

	return function () {
		chrome.extension.onMessage.addListener(onMessage);
	};
});