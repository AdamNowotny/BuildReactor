define(function () {
	
	'use strict';

	var updateSettings = function (settingsList) {
		chrome.runtime.sendMessage({name: "updateSettings", settings: settingsList});
	};

	var initOptions = function (callback) {
		chrome.runtime.sendMessage({name: "initOptions"}, callback);
	};

	var availableProjects = function (settings, callback) {
		chrome.runtime.sendMessage({name: "availableProjects", serviceSettings: settings}, callback);
	};

	return {
		initOptions: initOptions,
		updateSettings: updateSettings,
		availableProjects: availableProjects
	};
	
});