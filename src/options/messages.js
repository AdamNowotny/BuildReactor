define(function () {
	
	'use strict';

	var updateSettings = function (settingsList) {
		chrome.runtime.send({name: "updateSettings", settings: settingsList});
	};

	var initOptions = function (callback) {
		chrome.runtime.send({name: "initOptions"}, callback);
	};

	var availableProjects = function (settings, callback) {
		var message = {
			name: 'availableProjects',
			serviceSettings: settings
		};
		chrome.runtime.send(message, callback);
	};

	return {
		initOptions: initOptions,
		updateSettings: updateSettings,
		availableProjects: availableProjects
	};
	
});