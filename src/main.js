require.config({
	baseUrl: 'src',
	paths: {
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		jquery: "../components/jquery/jquery.min",
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		mout: '../components/mout/src',
		rx: 'rxjs',
		'rx.jquery': 'rxjs',
		'rx.time': 'rxjs',
		signals: '../components/js-signals/dist/signals',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore'
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	}
});
require([
	'rxjs',
	'main/backgroundLogger',
	'main/badgeController',
	'main/messageHandlers',
	'main/notificationController',
	'main/serviceController',
	'main/serviceRepository',
	'main/settingsStore',
	'services/bamboo/buildService',
	'services/buildbot/buildService',
	'services/cctray/buildService',
	'services/cruisecontrol/buildService',
	'services/cruisecontrol.net/buildService',
	'services/cruisecontrol.rb/buildService',
	'services/go/buildService',
	'services/jenkins/buildService',
	'services/teamcity/buildService',
	'services/travis/buildService'
], function (
	rxjs,
	backgroundLogger,
	badgeController,
	messageHandlers,
	notificationController,
	serviceController,
	serviceRepository,
	settingsStore,
	BambooService,
	BuildBotService,
	CctrayService,
	CruiseControlService,
	CruiseControlNetService,
	CruiseControlRBService,
	GoService,
	JenkinsService,
	TeamCityService,
	TravisService
) {
	'use strict';

	backgroundLogger();
	badgeController();
	notificationController();
	messageHandlers();
	serviceRepository.clear();
	serviceRepository.registerType(BambooService);
	serviceRepository.registerType(BuildBotService);
	serviceRepository.registerType(CctrayService);
	serviceRepository.registerType(CruiseControlService);
	serviceRepository.registerType(CruiseControlNetService);
	serviceRepository.registerType(CruiseControlRBService);
	serviceRepository.registerType(GoService);
	serviceRepository.registerType(JenkinsService);
	serviceRepository.registerType(TeamCityService);
	serviceRepository.registerType(TravisService);
	var settings = settingsStore.getAll();
	serviceController.load(settings).addOnce(function () {
		serviceController.run();
	});
});
