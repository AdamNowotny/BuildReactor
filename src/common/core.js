define([
	'common/chromeApi',
	'rx',
	'rx.binding'
], function (chromeApi, Rx) {
	
	'use strict';

	var init = function () {
		var statePort = chromeApi.connect({ name: 'state' });
		statePort.onMessage.addListener(function (message) {
			activeProjects.onNext(message);
		});
		var configPort = chromeApi.connect({ name: 'configuration' });
		configPort.onMessage.addListener(function (message) {
			configurations.onNext(message);
		});
	};

	var activeProjects = new Rx.ReplaySubject(1);
	var configurations = new Rx.ReplaySubject(1);
	var messages = new Rx.ReplaySubject(1);

	var availableServices = function (callback) {
		var message = { name: "availableServices" };
		messages.onNext(message);
		chromeApi.sendMessage(message, callback);
	};

	var availableProjects = function (settings, callback) {
		var message = { name: "availableProjects", serviceSettings: settings };
		messages.onNext(message);
		chromeApi.sendMessage(message, function (response) {
			messages.onNext({ name: "availableProjects", response: response, serviceSettings: settings });
			callback(response);
		});
	};

	var updateSettings = function (settingsList) {
		var message = { name: "updateSettings", settings: settingsList };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var enableService = function (name) {
		var message = { name: "enableService", serviceName: name };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var disableService = function (name) {
		var message = { name: "disableService", serviceName: name };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var removeService = function (name) {
		var message = { name: "removeService", serviceName: name };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var renameService = function (oldName, newName) {
		var message = { name: "renameService", oldName: oldName, newName: newName };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var updateService = function (settings) {
		var message = { name: "updateService", settings: settings };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	return {
		init: init,
		availableServices: availableServices,
		configurations: configurations,
		activeProjects: activeProjects,
		updateSettings: updateSettings,
		availableProjects: availableProjects,
		enableService: enableService,
		disableService: disableService,
		removeService: removeService,
		renameService: renameService,
		updateService: updateService,
		// for logging
		messages: messages
	};
	
});