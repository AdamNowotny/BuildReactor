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
	},
	cookies: {
		remove: function () {}
	}
};
require.config({
	baseUrl: '../src',
	paths: {
		messages: 'options/messagesStatic',
		bootbox: '../components/bootbox/bootbox',
		mout: '../components/mout/src',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
		fixtures: '../spec/fixtures',
		jasmineSignals: '../components/jasmine-signals/jasmine-signals',
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
		rx: '../components/rxjs/rx',
		'rx.jquery': '../components/rxjs-jquery/rx.jquery',
		'rx.time': '../components/rxjs/rx.time',
		bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons'
	},
	map: {
		'rx.jquery': {
			'jQuery': 'jquery'
		}
	},
	shim: {
		bootstrap: [ 'jquery' ],
		bootbox: {
			deps: [ 'bootstrap' ],
			exports: 'bootbox'
		},
		bootstrapToggle: {
			deps: [ 'jquery', 'bootstrap' ]
		}
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	waitSeconds: 2
});
