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
		jquery: '../lib/jquery/jquery',
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
	'spec/serviceControllerTest',
	'spec/serviceTypesRepositoryTest',
	'spec/settingsStoreTest',
	'spec/timerTest',
	'spec/bamboo/bambooPlanTest',
	'spec/bamboo/bambooRequestTest',
	'spec/bamboo/buildServiceTest',
	'spec/cctray/buildServiceTest',
	'spec/cctray/ccRequestTest',
	'spec/cctray/projectTest',
	'spec/settings/addModalTest',
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
	jasmine.getEnv().execute();
});