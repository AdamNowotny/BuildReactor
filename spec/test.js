/*global $:false, jasmine:true, chrome:true */
var chrome = {
	browserAction: {
		setBadgeText: function () {},
		setBadgeBackgroundColor: function () {}
	},
	tabs : {
		create: function () {}
	},
	runtime: {
		sendMessage: function () {},
		onMessage: {
			addListener: function () {}
		}
	},
	cookies: {
		remove: function () {}
	}
};

window.webkitNotifications = window.webkitNotifications || {};
window.webkitNotifications.createNotification = function () {};

jasmine.getFixtures().fixturesPath = 'spec/fixtures';
