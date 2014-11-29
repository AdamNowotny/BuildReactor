define([
	'src/common-ui/core.mock.availableServices.js',
	'src/common-ui/core.mock.activeProjects.js',
	'src/common-ui/core.mock.availableProjects.js',
	'src/common-ui/core.mock.configurations.js',
	'src/common-ui/core.mock.views.js',
	'rx',
	'rx.time'
], function (
	availableServicesResponse,
	activeProjectsResponse,
	availableProjectsResponse,
	configurations,
	views,
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
		views: views,
		activeProjects: Rx.Observable.returnValue(activeProjectsResponse),
		availableProjects: availableProjects,
		enableService: log,
		disableService: log,
		removeService: log,
		renameService: log,
		setOrder: log,
		messages: messages
	};

});
