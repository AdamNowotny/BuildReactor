require.config({
	baseUrl: 'src',
	paths: {
		mout: '../components/mout/src',
		jquery: "../components/jquery/jquery",
		signals: '../components/js-signals/dist/signals',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2'
	},
	hbs: {
		templateExtension: 'html',
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
	'services/teamcity/buildService'
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
	serviceRepository.registerType(BambooService);
	serviceRepository.registerType(CruiseControlService);
	serviceRepository.registerType(CruiseControlNetService);
	serviceRepository.registerType(CruiseControlRBService);
	serviceRepository.registerType(GoService);
	serviceRepository.registerType(JenkinsService);
	serviceRepository.registerType(TeamCityService);
	serviceRepository.registerType(CctrayService);
	var settings = settingsStore.getAll();
	serviceController.load(settings).addOnce(function () {
		serviceController.run();
	});
});
