require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		bootbox: '../bower_components/bootbox/bootbox',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
		bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
		'common/core': 'common/core',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		jasmineSignals: '../bower_components/jasmine-signals/jasmine-signals',
		jquery: '../bower_components/jquery/jquery',
		json: '../bower_components/requirejs-plugins/src/json',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		mout: '../bower_components/mout/src',
		signals: '../bower_components/js-signals/dist/signals',
		rx: '../bower_components/rxjs/rx.compat',
		'rx.async': '../bower_components/rxjs/rx.async',
		'rx.aggregates': '../bower_components/rxjs/rx.aggregates',
		'rx.binding': '../bower_components/rxjs/rx.binding',
		'rx.testing': '../bower_components/rxjs/rx.testing',
		'rx.time': '../bower_components/rxjs/rx.time',
		'rx.virtualtime': '../bower_components/rxjs/rx.virtualtime',
		text: '../bower_components/requirejs-text/text',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore'
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
		},
		'rx.testing': [ 'rx.virtualtime' ]
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	waitSeconds: 10
});
