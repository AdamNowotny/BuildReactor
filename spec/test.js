var chrome = {
	browserAction: {
		setBadgeText: function () { },
		setBadgeBackgroundColor: function () { }
	},
	cookies: {
		remove: function () {}
	},
	tabs : {
		create: function () {}
	}
};
require.config({
	baseUrl: '../src',
	paths: {
		amdUtils: '../lib/amd-utils',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
		fixtures: '../spec/fixtures',
		jasmineSignals: '../lib/jasmine-signals/jasmine-signals',
		jqueryTools: '../lib/jquery-tools/jquery.tools.min',
		jquery: [ '../lib/jquery/jquery-1.8.2.min', '../lib/jquery/jquery-1.8.2'],
		json: '../lib/requirejs/json',
		mocks: '../spec/mocks',
		spec: '../spec',
		signals: '../lib/js-signals/signals',
		text: '../lib/requirejs/text',
		has: '../lib/requirejs/has',
		urljs: '../lib/urljs/url-min',
		// Handlebars plugin does not like to be in lib folder.
		// Needed to rename to hbs-plugin and specifiy all paths here.
		hbs: '../lib/requirejs/hbs-plugin',
		Handlebars: '../lib/requirejs/Handlebars',
		'hbs/underscore': '../lib/requirejs/hbs/underscore',
		'hbs/i18nprecompile': '../lib/requirejs/hbs/i18nprecompile',
		'hbs/json2': '../lib/requirejs/hbs/json2'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		jqueryTools: [ 'jquery' ],
		urljs: { exports: 'URL' }
	},
	hbs: {
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	waitSeconds: 2
});
require([
	'jquery',
	'spec/ajaxRequestTest',
	'spec/badgeControllerTest',
	'spec/optionsControllerTest',
	'spec/notificationControllerTest',
	'spec/popupControllerTest',
	'spec/resourceFinderTest',
	'spec/serviceControllerTest',
	'spec/serviceTypesRepositoryTest',
	'spec/settingsStoreTest',
	'spec/timerTest',

	'spec/services/bamboo/bambooPlanTest',
	'spec/services/bamboo/bambooRequestTest',
	'spec/services/bamboo/buildServiceTest',
	'spec/services/cctray/buildServiceTest',
	'spec/services/cctray/ccRequestTest',
	'spec/services/cctray/projectTest',

	// 'spec/cruisecontrol/buildServiceTest',
	// 'spec/cruisecontrol.net/buildServiceTest',
	// 'spec/cruisecontrol.rb/buildServiceTest',
	// 'spec/go/buildServiceTest',
	// 'spec/jenkins/buildServiceTest',
	// 'spec/teamcity/buildServiceTest',

	'spec/settings/addServiceTest',
	'spec/settings/alertTest',
	'spec/settings/projectViewTest',
	'spec/settings/removePromptTest',
	'spec/settings/savePromptTest',
	'spec/settings/serviceListTest',
	'spec/settings/serviceOptionsTest',
	'spec/settings/serviceSettingsTest',
	'spec/settings/settingsFormViewTest'
], function ($) {
	
	'use strict';

	$.fx.off = true;
	jasmine.getFixtures().fixturesPath = 'fixtures';
	jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
	jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
	jasmine.getEnv().execute();
});