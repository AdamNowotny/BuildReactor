require.config({
	baseUrl: 'src',
	paths: {
		jquery: "../bower_components/jquery/jquery",
		mout: '../bower_components/mout/src',
		rx: '../bower_components/rxjs/rx',
		'rx.async': '../bower_components/rxjs/rx.async',
		'rx.binding': '../bower_components/rxjs/rx.binding',
		'rx.time': '../bower_components/rxjs/rx.time',
		signals: '../bower_components/js-signals/dist/signals'
	}
});

require([
	'jquery',
	'mout/array/contains',
	'mout/array/remove',
	'mout/object/deepMatches',
	'mout/object/equals',
	'mout/object/fillIn',
	'mout/object/mixIn',
	'mout/object/values',
	'mout/queryString/encode',
	'mout/string/endsWith',
	'mout/string/interpolate',
	'mout/string/startsWith',
	'rx',
	'rx.async',
	'rx.binding',
	'rx.time',
	'signals'
], function () {});