require.config({
	baseUrl: 'src',
	paths: {
		jquery: [ '../lib/jquery/jquery-1.8.2.min', '../lib/jquery/jquery-1.8.2'],
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
	'main/backgroundLogger',
	'main/badgeController',
	'main/notificationController',
	'main/serviceController',
	'main/serviceTypesRepository',
	'main/settingsStore',
	'services/bamboo/buildService',
	'services/cctray/buildService',
	'services/cruisecontrol/buildService',
	'services/cruisecontrol.net/buildService',
	'services/cruisecontrol.rb/buildService',
	'services/go/buildService',
	'services/jenkins/buildService',
	'services/teamcity/buildService',
], function (
	badgeController,
	backgroundLogger,
	notificationController,
	serviceController,
	serviceTypesRepository,
	settingsStore,
	BambooService,
	CctrayService,
	CruiseControlService,
	CruiseControlNetService,
	CruiseControlRBService,
	GoService,
	JenkinsService,
	TeamCityService
) {

	'use strict';

	function onMessage(request, sender, sendResponse) {
		switch (request.name) {
		case 'initOptions':
			sendResponse({
				settings: settingsStore.getAll(),
				serviceTypes: serviceTypesRepository.getAll()
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
		case 'serviceStateRequest':
			sendResponse({
				serviceState: serviceController.activeProjects()
			});
			break;
		}
	}

	chrome.extension.onMessage.addListener(onMessage);
	backgroundLogger();
	badgeController();
	notificationController();
	serviceTypesRepository.clear();
	serviceTypesRepository.register(BambooService);
	serviceTypesRepository.register(CruiseControlService);
	serviceTypesRepository.register(CruiseControlNetService);
	serviceTypesRepository.register(CruiseControlRBService);
	serviceTypesRepository.register(GoService);
	serviceTypesRepository.register(JenkinsService);
	serviceTypesRepository.register(TeamCityService);
	serviceTypesRepository.register(CctrayService);
	var settings = settingsStore.getAll();
	serviceController.load(settings).addOnce(function () {
		serviceController.run();
	});
});
