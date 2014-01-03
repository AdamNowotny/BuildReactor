require.config({
	baseUrl: 'src',
	paths: {
		jquery: "../bower_components/jquery/jquery.min",
		mout: '../bower_components/mout/src',
		rx: '../bower_components/rxjs/rx',
		'rx.binding': '../bower_components/rxjs/rx.binding',
		'rx.time': '../bower_components/rxjs/rx.time',
		signals: '../bower_components/js-signals/dist/signals'
	}
});
require([
	'core/backgroundLogger',
	'core/badgeController',
	'core/messageHandlers',
	'core/notificationController',
	'core/settingsStore',
	'core/services/serviceController',
	'core/services/bamboo/buildService',
	'core/services/buildbot/buildService',
	'core/services/cctray/buildService',
	'core/services/cruisecontrol/buildService',
	'core/services/cruisecontrol.net/buildService',
	'core/services/cruisecontrol.rb/buildService',
	'core/services/go/buildService',
	'core/services/jenkins/buildService',
	'core/services/snap/buildService',
	'core/services/teamcity/buildService',
	'core/services/travis/buildService'
], function (
	backgroundLogger,
	badgeController,
	messageHandlers,
	notificationController,
	settingsStore,
	serviceController,
	BambooService,
	BuildBotService,
	CctrayService,
	CruiseControlService,
	CruiseControlNetService,
	CruiseControlRBService,
	GoService,
	JenkinsService,
	SnapService,
	TeamCityService,
	TravisService
) {
	'use strict';

	backgroundLogger();
	badgeController();
	notificationController.init({ timeout: 5000 });
	messageHandlers.init();

	serviceController.clear();
	serviceController.registerType(BambooService);
	serviceController.registerType(BuildBotService);
	serviceController.registerType(CctrayService);
	serviceController.registerType(CruiseControlService);
	serviceController.registerType(CruiseControlNetService);
	serviceController.registerType(CruiseControlRBService);
	serviceController.registerType(GoService);
	serviceController.registerType(JenkinsService);
	serviceController.registerType(SnapService);
	serviceController.registerType(TeamCityService);
	serviceController.registerType(TravisService);

	var settings = settingsStore.getAll();
	serviceController.start(settings);
});
