require.config({
	baseUrl: '../',
	paths: {
		jquery: '../lib/jquery/jquery',
		signals: '../lib/js-signals/signals',
		bootstrap: '../lib/twitter-bootstrap/js/bootstrap.min'
	},
	shim: {
		bootstrap: [ 'jquery' ]
	}
});
