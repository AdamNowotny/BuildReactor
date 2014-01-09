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
		case 'initOptions':
			sendResponse({
				settings: serviceConfiguration.getAll(),
				serviceTypes: serviceController.getAllTypes()
			});
			break;
		case 'updateSettings':
			serviceConfiguration.setAll(request.settings);
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
		case 'enableService':
			serviceConfiguration.enableService(request.serviceName);
			break;
		case 'disableService':
			serviceConfiguration.disableService(request.serviceName);
			break;
		}
	}

	var messages = new Rx.Subject();

	var onConnect = function (port) {
		var onDisconnect = function (port) {
			stateSubscription.dispose();
		};
		var stateSubscription = serviceController.activeProjects.subscribe(function (servicesState) {
			port.postMessage(servicesState);
			messages.onNext(servicesState);
		});
		port.onDisconnect.addListener(onDisconnect);
	};

	return {
		init: function () {
			chromeApi.addConnectListener(onConnect);
			chromeApi.addMessageListener(onMessage);
		},
		messages: messages
	};
});