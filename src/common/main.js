require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular',
		'angular.route': '../bower_components/angular-route/angular-route',
		'angular.ui': '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
		'angular.ui.utils': '../bower_components/angular-ui-utils/ui-utils',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		htmlSortable: '../bower_components/html.sortable/dist/html.sortable.angular',
		htmlSortableJquery: '../bower_components/html.sortable/dist/html.sortable',
		jquery: "../bower_components/jquery/dist/jquery",
		mout: '../bower_components/mout/src',
		rx: '../bower_components/Rx/dist/rx',
		'rx.async': '../bower_components/Rx/dist/rx.async',
		'rx.binding': '../bower_components/Rx/dist/rx.binding',
		'rx.coincidence': '../bower_components/Rx/dist/rx.coincidence',
		'rx.time': '../bower_components/Rx/dist/rx.time',

		// mock by default for test web server
		// this wil be overriden for karma tests and compilation
		'common/core': 'common/core.mock'
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular.route': ['angular'],
		'angular.ui': ['angular'],
		'angular.ui.utils': ['angular'],
		bootstrap: [ 'jquery' ],
		htmlSortable: [ 'angular', 'htmlSortableJquery' ]
	}
});

// files that will be compiled into common/main.js
require([
	'jquery',
	'mout/array/contains',
	'mout/array/removeAll',
	'mout/object/deepMatches',
	'mout/object/mixIn',
	'mout/queryString/encode',
	'mout/string/endsWith',
	'mout/string/interpolate',
	'mout/string/startsWith',
	'rx',
	'rx.async',
	'rx.binding',
	'rx.time'
], function () {});
