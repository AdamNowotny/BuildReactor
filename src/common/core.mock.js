define([
	'src/common/core.mock.availableServices.js',
	'src/common/core.mock.activeProjects.js',
	'src/common/core.mock.availableProjects.js',
	'src/common/core.mock.configurations.js',
	'src/common/core.mock.views.js',
	'rx',
	'rx.time'
], function(
	availableServicesResponse,
	activeProjectsResponse,
	availableProjectsResponse,
	configurations,
	views,
	Rx
) {
	'use strict';

	var messages = new Rx.ReplaySubject(1);

	var availableServices = function(callback) {
		callback(availableServicesResponse);
	};

	var availableProjects = function(settings, callback) {
		callback(availableProjectsResponse);
	};

	var log = function(parameters) {
		messages.onNext(parameters);
	};

	return {
		init: function() {},
		availableServices: availableServices,
		configurations: configurations,
		views: views,
		activeProjects: Rx.Observable.return(activeProjectsResponse),
		availableProjects: availableProjects,
		enableService: log,
		disableService: log,
		removeService: log,
		renameService: log,
		setOrder: log,
		messages: messages
	};

});
