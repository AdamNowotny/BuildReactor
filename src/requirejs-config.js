require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		'options/messages': 'options/messages',
		'popup/messages': 'popup/messages',
		bootbox: '../bower_components/bootbox/bootbox',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
		bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
		fixtures: '../spec/fixtures',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		jasmineSignals: '../bower_components/jasmine-signals/jasmine-signals',
		jquery: '../bower_components/jquery/jquery',
		json: '../bower_components/requirejs-plugins/src/json',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		mocks: '../spec/mocks',
		mout: '../bower_components/mout/src',
		signals: '../bower_components/js-signals/dist/signals',
		spec: '../spec',
		rx: '../bower_components/Rx/rx',
		rxHelpers: '../spec/rxHelpers',
		'rx.aggregates': '../bower_components/Rx/rx.aggregates',
		'rx.binding': '../bower_components/Rx/rx.binding',
		'rx.jquery': '../bower_components/Rx-jQuery/rx.jquery',
		'rx.testing': '../bower_components/Rx/rx.testing',
		'rx.time': '../bower_components/Rx/rx.time',
		text: '../bower_components/requirejs-text/text',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore'
	},
	map: {
		'rx.jquery': {
			'jQuery': 'jquery'
		}
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		bootstrap: [ 'jquery' ],
		bootbox: {
			deps: [ 'bootstrap' ],
			exports: 'bootbox'
		},
		bootstrapToggle: {
			deps: [ 'jquery', 'bootstrap' ]
		},
		jquery: {
			exports: 'jquery'
		}
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	waitSeconds: 10
});
