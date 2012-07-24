require.config({
	baseUrl: 'src',
	paths: {
		jquery: '../lib/jquery/jquery',
		signals: '../lib/js-signals/signals'
	}
});
require(["app"], function (app) {
	'use strict';
	
	app.run();
});