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

	var availableServices = function (callback) {
		callback(availableServicesResponse);
	};

	var availableProjects = function (settings, callback) {
		callback(availableProjectsResponse);
	};

	return {
		init: function () {},
		availableServices: availableServices,
		configurations: configurations,
		activeProjects: Rx.Observable.returnValue(activeProjectsResponse),
		updateSettings: function () { },
		availableProjects: availableProjects,
		enableService: function () { },
		disableService: function () { },
		removeService: function () { },
		renameService: function () { },
		messages: Rx.Observable.never()
	};

});