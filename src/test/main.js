window.chrome = {
	browserAction: {
		setBadgeText: function() {},
		setBadgeBackgroundColor: function() {}
	},
	tabs : {
		create: function() {},
		query: function(queryInfo, callback) {}
	},
	runtime: {
		sendMessage: function() {},
		onMessage: {
			addListener: function() {}
		},
		connect: function() {
			'use strict';
			return {
				onMessage: {
					addListener: function() {}
				}
			};
		},
		onConnect: {
			addListener: function() {}
		}
	},
	extension: {
		sendMessage: function() {},
		onMessage: {
			addListener: function() {}
		},
		onConnect: {
			addListener: function() {}
		},
		connect: function() {},
		getURL: function(path) {}
	},
	cookies: {
		remove: function() {}
	}
};

window.Notification = function() {
	'use strict';

	return {
		show: function() {},
		close: function() {}
	};
};

// needed for RxJS to work in PhantomJS
// if (!Function.prototype.bind) {
// 	Function.prototype.bind = function (context) {
// 		'use strict';
// 		var self = this;
// 		return function () {
// 			return self.apply(context, arguments);
// 		};
// 	};
// }

// require('rx.testing');
// // require('babel-core/polyfill');
// require('angular');
// require('angular-mocks');

// const testsContext = require.context("../common", true, /.spec.js$/);
// testsContext.keys().forEach(testsContext);
const testsContext = require.context("../core/", true, /.spec.js$/);
testsContext.keys().forEach(testsContext);
