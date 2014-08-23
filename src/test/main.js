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

if (!Function.prototype.bind) {
	Function.prototype.bind = function (context) {
		'use strict';
		var self = this;
		return function () {
			return self.apply(context, arguments);
		};
	};
}

require.config({
	baseUrl: '/base/src',
	paths: {
		jquery: '../bower_components/jquery/dist/jquery',
		mout: '../bower_components/mout/src',
		rx: '../bower_components/Rx/dist/rx',
		'rx.async': '../bower_components/Rx/dist/rx.async',
		'rx.binding': '../bower_components/Rx/dist/rx.binding',
		'rx.time': '../bower_components/Rx/dist/rx.time',

		angular: '../bower_components/angular/angular',
		'angular.route': '../bower_components/angular-route/angular-route',
		'angular.ui': '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
		'angular.ui.utils': '../bower_components/angular-ui-utils/ui-utils',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		htmlSortable: '../bower_components/html.sortable/dist/html.sortable.angular',
		htmlSortableJquery: '../bower_components/html.sortable/dist/html.sortable',
		'rx.angular': '../bower_components/angular-rx/rx.angular',

		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		'common/core': 'common/core',
		'rx.aggregates': '../bower_components/Rx/dist/rx.aggregates',
		'rx.testing': '../bower_components/Rx/dist/rx.testing',
		'rx.virtualtime': '../bower_components/Rx/dist/rx.virtualtime',
		text: '../bower_components/requirejs-text/text',
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular.route': ['angular'],
		'angular.ui': ['angular'],
		'angular.ui.utils': ['angular'],
		bootstrap: [ 'jquery' ],
		htmlSortable: [ 'angular', 'htmlSortableJquery' ],
		'rx.angular': [ 'angular', 'rx' ],

		'rx.testing': [ 'rx.virtualtime' ],
		angularMocks: {
			deps: ['angular'],
			exports: 'angular.mock'
		},
		'settings/directives/sidebar/sidebar.html': ['angular']
	},
	waitSeconds: 10,
	deps: deps,
	callback: window.__karma__.start
});
