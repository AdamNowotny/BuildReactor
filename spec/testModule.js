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
		'spec/cctray/buildServiceTest',
		'spec/cctray/projectFactoryTest',
		'spec/cctray/settingsControllerTest',
		'spec/cctray/ccRequestTest',
		'spec/common/projectViewTest'
	], function () {

		return {
			runSpecs: function () {
				$.fx.off = true;
				jasmine.getFixtures().fixturesPath = 'fixtures';
				jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
				jasmine.getEnv().execute();
			}
		};
	});