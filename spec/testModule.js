define([
		'jquery',
		'spec/ajaxRequestTest',
		'spec/notificationControllerTest',
		'spec/serviceControllerTest',
		'spec/settingsPageControllerTest',
		'spec/settingsAddControllerTest',
		'spec/settingsStoreTest',
		'spec/timerTest',
		'spec/bamboo/bambooBuildServiceTest',
		'spec/bamboo/bambooPlanTest',
		'spec/bamboo/bambooRequestTest',
		'spec/bamboo/bambooSettingsControllerTest'
	], function() {

		return {
			runSpecs: function () {
				$.fx.off = true;
				jasmine.getFixtures().fixturesPath = 'spec/fixtures';
				jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
				jasmine.getEnv().execute();
			}
		};
	});