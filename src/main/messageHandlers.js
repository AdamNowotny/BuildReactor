define([
	'common/resourceFinder',
	'main/settingsStore',
	'main/serviceTypesRepository',
	'main/serviceController'
], function (resourceFinder, settingsStore, serviceTypesRepository, serviceController) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'initOptions':
			sendResponse({
				settings: settingsStore.getAll(),
				serviceTypes: serviceTypesRepository.getAll()
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
			var serviceModuleName = resourceFinder.service(request.serviceSettings);
			require([serviceModuleName], function (BuildService) {
				var service = new BuildService(request.serviceSettings);
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