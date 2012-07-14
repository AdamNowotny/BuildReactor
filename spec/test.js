var chrome = {
	browserAction: {
		setBadgeText: function() { },
		setBadgeBackgroundColor: function() { }
	}
};
require.config({
	baseUrl: '../',
	paths: {
		spec: 'spec',
		mocks: 'spec/mocks',
		fixtures: 'spec/fixtures',
		amdUtils: 'lib/amd-utils',
		jquery: 'lib/jquery/jquery',
		xml2json: 'lib/jquery/jquery.xml2json',
		jqueryTools: 'lib/jquery-tools/jquery.tools.min',
		text: 'lib/requirejs/text',
		json: 'lib/requirejs/json',
		order: 'lib/requirejs/order',
		handlebars: 'lib/requirejs-handlebars-plugin/Handlebars',
		signals: 'lib/js-signals/signals',
		jasmineSignals: 'lib/jasmine-signals/jasmine-signals',
		bootstrap: 'lib/twitter-bootstrap/js/bootstrap'
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
], function(testModule) {
	$.fx.off = true;
	jasmine.getFixtures().fixturesPath = 'fixtures';
	jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
	jasmine.getEnv().execute();
});