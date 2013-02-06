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
$.fx.off = true;
jasmine.getFixtures().fixturesPath = 'spec/fixtures';
var x = 0;
beforeEach(function () {
	'use strict';
	console.warn(x++, new Date().toUTCString(), this.suite.description, this.description);
});