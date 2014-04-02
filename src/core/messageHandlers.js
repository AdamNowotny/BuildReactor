define([
	'core/services/serviceLoader',
	'core/services/serviceController',
	'core/services/serviceConfiguration',
	'common/chromeApi',
	'rx'
], function (serviceLoader, serviceController, serviceConfiguration, chromeApi, Rx) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'availableServices':
			sendResponse(serviceController.getAllTypes());
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
		case 'updateSettings':
			serviceConfiguration.setAll(request.settings);
			break;
		case 'enableService':
			serviceConfiguration.enableService(request.serviceName);
			break;
		case 'disableService':
			serviceConfiguration.disableService(request.serviceName);
			break;
		case 'removeService':
			serviceConfiguration.removeService(request.serviceName);
			break;
		case 'renameService':
			serviceConfiguration.renameService(request.oldName, request.newName);
			break;
		case 'saveService':
			serviceConfiguration.saveService(request.settings);
			break;
		}
	}

	var messages = new Rx.Subject();

	var onConnect = function (port) {
		switch (port.name) {
		case 'state':
			var stateSubscription = serviceController.activeProjects.subscribe(function (servicesState) {
				port.postMessage(servicesState);
			});
			port.onDisconnect.addListener(function (port) {
				stateSubscription.dispose();
			});
			break;
		case 'configuration':
			var configSubscription = serviceConfiguration.changes.subscribe(function (config) {
				port.postMessage(config);
			});
			port.onDisconnect.addListener(function (port) {
				configSubscription.dispose();
			});
			break;
		}
	};

	return {
		init: function () {
			chromeApi.addConnectListener(onConnect);
			chromeApi.addMessageListener(onMessage);
		}
	};
});