define([
	'src/common/core.mock.initOptions.js',
	'src/common/core.mock.activeProjects.js',
	'src/common/core.mock.availableProjects.js',
	'rx',
	'rx.time'
], function (initOptionsResponse, activeProjectsResponse, availableProjectsResponse, Rx) {

	'use strict';



	var updateSettings = function (settingsList) {
	};

	var initOptions = function (callback) {
		callback(initOptionsResponse);
	};

	var availableProjects = function (settings, callback) {
		callback(availableProjectsResponse);
	};

	return {
		init: function () {},
		activeProjects: Rx.Observable.returnValue(activeProjectsResponse),
		initOptions: initOptions,
		updateSettings: updateSettings,
		availableProjects: availableProjects,
		enableService: function () { },
		disableService: function () { }
	};

});