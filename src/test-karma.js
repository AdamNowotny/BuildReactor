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

var tests = Object.keys(window.__karma__.files).filter(function (file) {
	'use strict';

	return (/\.spec\.js$/).test(file);
});

require.config({
	baseUrl: '/base/src',
	deps: tests,
	callback: window.__karma__.start
});
