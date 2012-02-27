define([
		'jquery',
		'tests/ajaxRequestTest',
		'tests/notificationControllerTest',
		'tests/serviceControllerTest',
		'tests/settingsPageControllerTest',
		'tests/settingsAddControllerTest',
		'tests/settingsStoreTest',
		'tests/timerTest',
		'tests/bamboo/bambooBuildServiceTest',
		'tests/bamboo/bambooPlanTest',
		'tests/bamboo/bambooRequestTest',
		'tests/bamboo/bambooSettingsControllerTest'
	], function() {

		return {
			runSpecs: function () {
				//$.fx.off = true;
				jasmine.getFixtures().fixturesPath = 'tests/testdata';
				jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
				jasmine.getEnv().execute();
			}
		};
	});