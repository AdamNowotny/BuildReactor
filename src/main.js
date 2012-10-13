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
	'main/messageHandlers',
	'main/notificationController',
	'main/serviceController',
	'main/serviceRepository',
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
	backgroundLogger,
	badgeController,
	messageHandlers,
	notificationController,
	serviceController,
	serviceRepository,
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

	backgroundLogger();
	badgeController();
	notificationController();
	messageHandlers();
	serviceRepository.clear();
	serviceRepository.register(BambooService);
	serviceRepository.register(CruiseControlService);
	serviceRepository.register(CruiseControlNetService);
	serviceRepository.register(CruiseControlRBService);
	serviceRepository.register(GoService);
	serviceRepository.register(JenkinsService);
	serviceRepository.register(TeamCityService);
	serviceRepository.register(CctrayService);
	var settings = settingsStore.getAll();
	serviceController.load(settings).addOnce(function () {
		serviceController.run();
	});
});
