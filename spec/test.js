var chrome = {
	browserAction: {
		setBadgeText: function () {},
		setBadgeBackgroundColor: function () {}
	},
	cookies: {
		remove: function () {}
	},
	tabs : {
		create: function () {}
	},
	extension: {
		sendMessage: function () {},
		onMessage: {
			addListener: function () {}
		}
	}
};
require.config({
	baseUrl: '../src',
	paths: {
		amdUtils: '../components/amd-utils/src',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
		fixtures: '../spec/fixtures',
		jasmineSignals: '../lib/jasmine-signals/jasmine-signals',
		jquery: '../components/jquery/jquery',
		json: '../components/requirejs-plugins/src/json',
		mocks: '../spec/mocks',
		spec: '../spec',
		signals: '../components/js-signals/dist/signals',
		text: '../components/requirejs-text/text',
		has: '../components/has/has',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2'
	},
	shim: {
		bootstrap: [ 'jquery' ]
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	waitSeconds: 2
});
require([
	'jquery',
	'spec/popupControllerTest',
	'spec/common/joinUrlTest',
	'spec/common/timerTest',
	'spec/common/resourceFinderTest',
	'spec/main/ajaxRequestTest',
	'spec/main/badgeControllerTest',
	'spec/main/messageHandlersTest',
	'spec/main/notificationControllerTest',
	'spec/main/serviceControllerTest',
	'spec/main/serviceRepositoryTest',
	'spec/main/settingsStoreTest',
	'spec/services/buildTest',
	'spec/services/buildServiceTest',
	'spec/services/poolingServiceTest',
	'spec/services/bamboo/bambooPlanTest',
	'spec/services/bamboo/bambooRequestTest',
	'spec/services/bamboo/buildServiceTest',
	'spec/services/cctray/buildServiceTest',
	'spec/services/cctray/ccRequestTest',
	'spec/services/cctray/projectTest',
	'spec/services/cruisecontrol/buildServiceTest',
	'spec/services/cruisecontrol.net/buildServiceTest',
	'spec/services/cruisecontrol.rb/buildServiceTest',
	'spec/services/go/buildServiceTest',
	'spec/services/jenkins/buildServiceTest',
	'spec/services/teamcity/buildServiceTest',
	'spec/services/teamcity/teamcityBuildTest',
	'spec/services/teamcity/teamcityRequestTest',
	'spec/options/addServiceTest',
	'spec/options/alertTest',
	'spec/options/optionsControllerTest',
	'spec/options/projectViewTest',
	'spec/options/removePromptTest',
	'spec/options/savePromptTest',
	'spec/options/serviceListTest',
	'spec/options/serviceOptionsPageTest',
	'spec/options/serviceSettingsTest',
	'spec/options/settingsFormViewTest'
], function ($) {
	
	'use strict';

	$.fx.off = true;
	jasmine.getFixtures().fixturesPath = 'fixtures';
	jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
	jasmine.getEnv().execute();
});