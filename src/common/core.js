define([
	'common/chromeApi',
	'rx',
	'rx.binding'
], function (chromeApi, Rx) {
	
	'use strict';

	var init = function () {
		var port = chromeApi.connect({ name: 'state' });
		port.onMessage.addListener(function (message) {
			activeProjects.onNext(message);
		});
	};

	var activeProjects = new Rx.BehaviorSubject([]);
	
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
		init: init,
		activeProjects: activeProjects,
		initOptions: initOptions,
		updateSettings: updateSettings,
		availableProjects: availableProjects
	};
	
});