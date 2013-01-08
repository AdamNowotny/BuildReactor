var chrome = {
	browserAction: {
		setBadgeText: function () {},
		setBadgeBackgroundColor: function () {}
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
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		rx: '../lib/rx/rx.min'
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
