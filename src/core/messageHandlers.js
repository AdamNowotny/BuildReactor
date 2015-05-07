define([
	'core/services/serviceLoader',
	'core/services/serviceController',
	'core/config/serviceConfiguration',
	'core/config/viewConfiguration',
	'common/chromeApi',
	'rx'
], function (serviceLoader, serviceController, serviceConfiguration, viewConfiguration, chromeApi, Rx) {

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
		case 'setOrder':
			serviceConfiguration.setOrder(request.order);
			break;
		case 'setBuildOrder':
			serviceConfiguration.setBuildOrder(request.serviceName, request.order);
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
		case 'setViews':
			viewConfiguration.save(request.views);
			break;
		}
	}

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
		case 'views':
			var viewSubscription = viewConfiguration.changes.subscribe(function (config) {
				port.postMessage(config);
			});
			port.onDisconnect.addListener(function (port) {
				viewSubscription.dispose();
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
