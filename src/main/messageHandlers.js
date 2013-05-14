define([
	'main/settingsStore',
	'main/serviceLoader',
	'main/serviceController',
	'rx'
], function (settingsStore, serviceLoader, serviceController, Rx) {

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

	var stateSubscription;
	var messages = new Rx.Subject();

	var onConnect = function (port) {
		stateSubscription = serviceController.activeProjects.subscribe(function (servicesState) {
			port.postMessage(servicesState);
			messages.onNext(servicesState);
		});
		port.onDisconnect.addListener(onDisconnect);
	};

	var onDisconnect = function (port) {
		stateSubscription.dispose();
	};

	return {
		init: function () {
			chrome.runtime.onConnect.addListener(onConnect);
			chrome.runtime.onMessage.addListener(onMessage);
		},
		messages: messages
	};
});