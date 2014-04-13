require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular',
		angularBootstrapSwitch: '../bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch',
		'angular.route': '../bower_components/angular-route/angular-route',
		'angular.ui': '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
		'angular.ui.utils': '../bower_components/angular-ui-utils/ui-utils',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		bootstrapSwitch: '../bower_components/bootstrap-switch/build/js/bootstrap-switch',
		'common/core': 'common/core.mock',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		'rx.angular': '../bower_components/angular-rx/rx.angular',
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
		angularBootstrapSwitch: [ 'bootstrapSwitch' ],
		'angular.route': ['angular'],
		'angular.ui': ['angular'],
		'angular.ui.utils': ['angular'],
		bootstrap: [ 'jquery' ],
		bootstrapSwitch: [ 'jquery' ],
		'rx.angular': [ 'angular', 'rx' ],
	}
});

require([
	'common/main',
	'angular',
	'angular.route',
	'bootstrap'
], function () { });