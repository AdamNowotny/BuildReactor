/*global $:false, jasmine:true */
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
	}
};
window.webkitNotifications = window.webkitNotifications || {};
window.webkitNotifications.createNotification = function () {};

jasmine.getFixtures().fixturesPath = 'spec/fixtures';
