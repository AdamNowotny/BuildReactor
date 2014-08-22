require.config({
	baseUrl: 'src',
	paths: {
		jquery: "../bower_components/jquery/dist/jquery",
		mout: '../bower_components/mout/src',
		rx: '../bower_components/Rx/dist/rx',
		'rx.async': '../bower_components/Rx/dist/rx.async',
		'rx.binding': '../bower_components/Rx/dist/rx.binding',
		'rx.time': '../bower_components/Rx/dist/rx.time'
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
	'rx.time'
], function () {});