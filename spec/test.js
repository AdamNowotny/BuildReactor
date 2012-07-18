var chrome = {
	browserAction: {
		setBadgeText: function () { },
		setBadgeBackgroundColor: function () { }
	}
};
require.config({
	baseUrl: '../src',
	paths: {
		amdUtils: '../lib/amd-utils',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
		fixtures: '../spec/fixtures',
		handlebars: '../lib/requirejs-handlebars-plugin/Handlebars',
		jasmineSignals: '../lib/jasmine-signals/jasmine-signals',
		jqueryTools: '../lib/jquery-tools/jquery.tools.min',
		jquery: '../lib/jquery/jquery',
		json: '../lib/requirejs/json',
		mocks: '../spec/mocks',
		spec: '../spec',
		signals: '../lib/js-signals/signals',
		text: '../lib/requirejs/text'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		jqueryTools: [ 'jquery' ]
	},
	waitSeconds: 2
});
require([
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
], function ($) {
	$.fx.off = true;
	jasmine.getFixtures().fixturesPath = 'fixtures';
	jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
	jasmine.getEnv().execute();
});