require.config({
	baseUrl: 'src',
	paths: {
		jquery: '../lib/jquery/jquery',
		signals: '../lib/js-signals/signals'
	}
});
require([
	'serviceController',
	'notificationController',
	'badgeController',
	'settingsStore',
	'backgroundLogger'
], function (serviceController, notificationController, badgeController, settingsStore, backgroundLogger) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'getSettings':
			sendResponse({
				settings: settingsStore.getAll()
			});
			break;
		case 'updateSettings':
			settingsStore.store(request.settings);
			serviceController.load(request.settings);
			serviceController.run();
			sendResponse({
				name: 'settingsSaved'
			});
			break;
		}
	}

	backgroundLogger();
	badgeController();
	notificationController();
	var settings = settingsStore.getAll();
	serviceController.load(settings);
	chrome.extension.onMessage.addListener(onMessage);
	serviceController.run();
});
