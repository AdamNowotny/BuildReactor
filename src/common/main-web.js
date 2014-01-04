require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular',
		'angular.route': '../bower_components/angular-route/angular-route',
		bootbox: '../bower_components/bootbox/bootbox',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
		bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
		'common/core': 'common/core.mock',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore'
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular.route': ['angular'],
		bootstrap: [ 'jquery' ],
		bootbox: {
			deps: [ 'jquery', 'bootstrap' ],
			exports: 'bootbox'
		},
		bootstrapToggle: [ 'jquery', 'bootstrap' ]
	}
});

require([
	'common/main',
	'angular',
	'angular.route',
	'bootstrap',
	'bootstrapToggle'
], function () {
	// bootstrapToggle depends on jQuery to be loaded already
});