define([
	'src/common/core.mock.availableServices.js',
	'src/common/core.mock.activeProjects.js',
	'src/common/core.mock.availableProjects.js',
	'src/common/core.mock.configurations.js',
	'rx',
	'rx.time'
], function (
	availableServicesResponse,
	activeProjectsResponse,
	availableProjectsResponse,
	configurations,
	Rx
) {
	'use strict';

	var messages = new Rx.ReplaySubject(1);

	var availableServices = function (callback) {
		callback(availableServicesResponse);
	};

	var availableProjects = function (settings, callback) {
		callback(availableProjectsResponse);
	};

	var log = function (parameters) {
		messages.onNext(parameters);
	};

	return {
		init: function () {},
		availableServices: availableServices,
		configurations: configurations,
		activeProjects: Rx.Observable.returnValue(activeProjectsResponse),
		updateSettings: log,
		availableProjects: availableProjects,
		enableService: log,
		disableService: log,
		removeService: log,
		renameService: log,
		setOrder: log,
		messages: messages
	};

});