require.config({
	baseUrl: '../',
	paths: {
		jquery: '../lib/jquery/jquery',
		signals: '../lib/js-signals/signals',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min',
		has: '../lib/requirejs/has',
		urljs: '../lib/urljs/url-min'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		urljs: { exports: 'URL' }
	}
});
