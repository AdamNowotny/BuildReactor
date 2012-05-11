define([
		'jquery',
		'spec/ajaxRequestTest',
		'spec/notificationControllerTest',
		'spec/serviceControllerTest',
		'spec/settingsPageControllerTest',
		'spec/settingsStoreTest',
		'spec/serviceTypesRepositoryTest',
		'spec/timerTest',
		'spec/settings/addModalTest',
		'spec/settings/serviceSettingsTest',
		'spec/settings/serviceListTest',
		'spec/settings/savePromptTest',
		'spec/settings/removePromptTest',
		'spec/settings/frameTest',
		'spec/bamboo/buildServiceTest',
		'spec/bamboo/bambooPlanTest',
		'spec/bamboo/bambooRequestTest',
		'spec/bamboo/settingsControllerTest',
		'spec/cruisecontrol/settingsControllerTest',
		'spec/cruisecontrol/ccRequestTest',
		'spec/cruisecontrol/projectViewTest'
	], function () {

		return {
			runSpecs: function () {
				$.fx.off = true;
				jasmine.getFixtures().fixturesPath = 'spec/fixtures';
				jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
				jasmine.getEnv().execute();
			}
		};
	});