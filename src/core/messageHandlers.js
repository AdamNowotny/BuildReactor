define([
	'core/services/serviceController',
	'core/config/serviceConfiguration',
	'core/config/viewConfiguration',
	'common/chromeApi',
	'rx'
], function(serviceController, serviceConfiguration, viewConfiguration, chromeApi, Rx) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'availableServices':
			availableServices(sendResponse);
			break;
		case 'availableProjects':
			availableProjects(sendResponse, request.serviceSettings);
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
		case 'saveConfig':
			serviceConfiguration.save(request.config);
			break;
		case 'setViews':
			viewConfiguration.save(request.views);
			break;
		default:
			break;
		}
		return false;
	}

	const availableServices = (sendResponse) => {
		const types = serviceController.getAllTypes();
		const settingList = Object.keys(types).map((k) => types[k]).map((t) => t.settings());
		return sendResponse(settingList);
	};

	const availableProjects = (sendResponse, settings) => {
		const Service = serviceController.getAllTypes()[settings.baseUrl];
		new Service(settings).availableBuilds().subscribe(function(projects) {
			projects.selected = settings.projects;
			sendResponse({ projects });
		}, function(error) {
			sendResponse({ error });
		});
	};

	var onConnect = function(port) {
		switch (port.name) {
		case 'state':
			var stateSubscription = serviceController.activeProjects.subscribe(function(servicesState) {
				port.postMessage(servicesState);
			});
			port.onDisconnect.addListener(function(port) {
				stateSubscription.dispose();
			});
			break;
		case 'configuration':
			var configSubscription = serviceConfiguration.changes.subscribe(function(config) {
				port.postMessage(config);
			});
			port.onDisconnect.addListener(function(port) {
				configSubscription.dispose();
			});
			break;
		case 'views':
			var viewSubscription = viewConfiguration.changes.subscribe(function(config) {
				port.postMessage(config);
			});
			port.onDisconnect.addListener(function(port) {
				viewSubscription.dispose();
			});
			break;
		}
	};

	return {
		init: function() {
			chromeApi.addConnectListener(onConnect);
			chromeApi.addMessageListener(onMessage);
		}
	};
});
