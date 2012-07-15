require.config({
	baseUrl: '..',
	paths: {
		jquery: 'lib/jquery/jquery',
		amdUtils: 'lib/amd-utils',
		text: 'lib/requirejs/text',
		signals: 'lib/js-signals/signals'
	},
	shim: {
		xml2json: [ 'jquery' ]
	}
});
require(["src/app"], function (app) {
	app.run();
});