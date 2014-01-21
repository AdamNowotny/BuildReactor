var chrome = {
	browserAction: {
		setBadgeText: function () {},
		setBadgeBackgroundColor: function () {}
	},
	tabs : {
		create: function () {},
		query: function (queryInfo, callback) {}
	},
	runtime: {
		sendMessage: function () {},
		onMessage: {
			addListener: function () {}
		},
		connect: function () {
			'use strict';
			return {
				onMessage: {
					addListener: function () {}
				}
			};
		},
		onConnect: {
			addListener: function () {}
		}
	},
	extension: {
		sendMessage: function () {},
		onMessage: {
			addListener: function () {}
		},
		onConnect: {
			addListener: function () {}
		},
		connect: function () {},
		getURL: function (path) {}
	},
	cookies: {
		remove: function () {}
	}
};

window.webkitNotifications = window.webkitNotifications || {};
window.webkitNotifications.createNotification = function () {};

jasmine.getFixtures().fixturesPath = 'base/';

var deps = Object.keys(window.__karma__.files).filter(function (file) {
	'use strict';

	return (/\.spec\.js$/).test(file);
});
deps.push('angularMocks');

require.config({
	baseUrl: '/base/src',
	paths: {
		jquery: "../bower_components/jquery/jquery",
		mout: '../bower_components/mout/src',
		rx: '../bower_components/rxjs/rx',
		'rx.async': '../bower_components/rxjs/rx.async',
		'rx.binding': '../bower_components/rxjs/rx.binding',
		'rx.time': '../bower_components/rxjs/rx.time',
		signals: '../bower_components/js-signals/dist/signals',

		angular: '../bower_components/angular/angular',
		angularBootstrapSwitch: '../bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch',
		'angular.route': '../bower_components/angular-route/angular-route',
		'angular.ui': '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
		bootbox: '../bower_components/bootbox/bootbox',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		bootstrapSwitch: '../bower_components/bootstrap-switch/build/js/bootstrap-switch',
		handlebars: '../lib/require-handlebars-plugin/Handlebars',
		hbs: '../lib/require-handlebars-plugin/hbs-plugin',
		i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
		json2: '../lib/require-handlebars-plugin/hbs/json2',
		underscore: '../lib/require-handlebars-plugin/hbs/underscore',
		'rx.angular': '../bower_components/angular-rx/rx.angular',

		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		'common/core': 'common/core',
		jasmineSignals: '../bower_components/jasmine-signals/jasmine-signals',
		'rx.aggregates': '../bower_components/rxjs/rx.aggregates',
		'rx.testing': '../bower_components/rxjs/rx.testing',
		'rx.virtualtime': '../bower_components/rxjs/rx.virtualtime',
		text: '../bower_components/requirejs-text/text',
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		angularBootstrapSwitch: [ 'bootstrapSwitch' ],
		'angular.route': ['angular'],
		'angular.ui': ['angular'],
		bootbox: {
			deps: [ 'bootstrap' ],
			exports: 'bootbox'
		},
		bootstrap: [ 'jquery' ],
		bootstrapSwitch: [ 'jquery' ],
		'rx.angular': [ 'angular', 'rx' ],

		'rx.testing': [ 'rx.virtualtime' ],
		angularMocks: [ 'angular' ]
	},
	hbs: {
		templateExtension: 'html',
		helperDirectory: 'templates/helpers/',
		i18nDirectory:   'templates/i18n/'
	},
	waitSeconds: 10,
	deps: deps,
	callback: window.__karma__.start
});
