require.config({
	baseUrl: 'src',
	paths: {
		amdUtils: '../lib/amd-utils',
		jquery: '../lib/jquery/jquery',
		signals: '../lib/js-signals/signals',
		text: '../lib/requirejs/text'
	}
});
require(["app"], function (app) {
	app.run();
});