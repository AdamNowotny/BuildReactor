require.config({
	baseUrl: 'src',
	paths: {
		jquery: '../lib/jquery/jquery',
		signals: '../lib/js-signals/signals',
		has: '../lib/requirejs/has',
		urljs: '../lib/urljs/url-min'
	},
	shim: {
		urljs: { exports: 'URL' }
	},
	hbs: {
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
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
			serviceController.load(request.settings).addOnce(function () {
				serviceController.run();
				sendResponse({
					name: 'settingsSaved'
				});
			});
			break;
		}
	}

	chrome.extension.onMessage.addListener(onMessage);
	backgroundLogger();
	badgeController();
	notificationController();
	var settings = settingsStore.getAll();
	serviceController.load(settings).addOnce(function () {
		serviceController.run();
	});
});
