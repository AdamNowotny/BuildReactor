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

var deps = Object.keys(window.__karma__.files).filter(function (file) {
	'use strict';

	return (/\.spec\.js$/).test(file);
});
deps.push('angularMocks');

require.config({
	baseUrl: '/base/src',
	paths: {
		jquery: "../bower_components/jquery/dist/jquery",
		mout: '../bower_components/mout/src',
		rx: '../bower_components/rxjs/rx',
		'rx.async': '../bower_components/rxjs/rx.async',
		'rx.binding': '../bower_components/rxjs/rx.binding',
		'rx.time': '../bower_components/rxjs/rx.time',

		angular: '../bower_components/angular/angular',
		'angular.route': '../bower_components/angular-route/angular-route',
		'angular.ui': '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		'rx.angular': '../bower_components/angular-rx/rx.angular',

		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		'common/core': 'common/core',
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
		'angular.route': ['angular'],
		'angular.ui': ['angular'],
		bootstrap: [ 'jquery' ],
		'rx.angular': [ 'angular', 'rx' ],

		'rx.testing': [ 'rx.virtualtime' ],
		angularMocks: [ 'angular' ]
	},
	waitSeconds: 10,
	deps: deps,
	callback: window.__karma__.start
});
