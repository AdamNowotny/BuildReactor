define([
	'core/settingsStore',
	'core/services/serviceLoader',
	'core/services/serviceController',
	'common/chromeApi',
	'rx'
], function (settingsStore, serviceLoader, serviceController, chromeApi, Rx) {

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
			serviceController.start(request.settings);
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