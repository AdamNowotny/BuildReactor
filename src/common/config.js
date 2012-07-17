require.config({
	baseUrl: '../',
	paths: {
		jquery: '../lib/jquery/jquery',
		text: '../lib/requirejs/text',
		order: '../lib/requirejs/order',
		amdUtils: '../lib/amd-utils',
		signals: '../lib/js-signals/signals',
		handlebars: '../lib/requirejs-handlebars-plugin/Handlebars',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min'
	},
	shim: {
		bootstrap: [ 'jquery' ]
	}
});
