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
		var viewConfigPort = chromeApi.connect({ name: 'views' });
		viewConfigPort.onMessage.addListener(function (message) {
			viewConfigurations.onNext(message);
		});
	};

	var activeProjects = new Rx.ReplaySubject(1);
	var configurations = new Rx.ReplaySubject(1);
	var viewConfigurations = new Rx.ReplaySubject(1);
	var messages = new Rx.ReplaySubject(1);

	var availableServices = function (callback) {
		var message = { name: 'availableServices' };
		messages.onNext(message);
		chromeApi.sendMessage(message, callback);
	};

	var availableProjects = function (settings, callback) {
		var message = { name: 'availableProjects', serviceSettings: settings };
		messages.onNext(message);
		chromeApi.sendMessage(message, function (response) {
			messages.onNext({ name: 'availableProjects', response: response, serviceSettings: settings });
			callback(response);
		});
	};

	var setOrder = function (serviceNames) {
		var message = { name: 'setOrder', order: serviceNames };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var setBuildOrder = function (serviceName, builds) {
		var message = { name: 'setBuildOrder', serviceName: serviceName, order: builds };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var enableService = function (name) {
		var message = { name: 'enableService', serviceName: name };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var disableService = function (name) {
		var message = { name: 'disableService', serviceName: name };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var removeService = function (name) {
		var message = { name: 'removeService', serviceName: name };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var renameService = function (oldName, newName) {
		var message = { name: 'renameService', oldName: oldName, newName: newName };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	var saveService = function (settings) {
		var message = { name: 'saveService', settings: settings };
		messages.onNext(message);
		chromeApi.sendMessage(message);
	};

	return {
		init: init,
		availableServices: availableServices,
		configurations: configurations,
		views: viewConfigurations,
		activeProjects: activeProjects,
		setOrder: setOrder,
		setBuildOrder: setBuildOrder,
		availableProjects: availableProjects,
		enableService: enableService,
		disableService: disableService,
		removeService: removeService,
		renameService: renameService,
		saveService: saveService,
		// for logging
		messages: messages
	};

});
