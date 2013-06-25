define(['common/chromeApi'], function (chromeApi) {
	
	'use strict';

	var updateSettings = function (settingsList) {
		chromeApi.sendMessage({name: "updateSettings", settings: settingsList});
	};

	var initOptions = function (callback) {
		chromeApi.sendMessage({name: "initOptions"}, callback);
	};

	var availableProjects = function (settings, callback) {
		chromeApi.sendMessage({name: "availableProjects", serviceSettings: settings}, callback);
	};

	return {
		initOptions: initOptions,
		updateSettings: updateSettings,
		availableProjects: availableProjects
	};
	
});