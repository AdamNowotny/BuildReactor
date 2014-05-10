require.config({
	baseUrl: 'src',
	paths: {
		angular: '../bower_components/angular/angular',
		'angular.route': '../bower_components/angular-route/angular-route',
		'angular.ui': '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
		'angular.ui.utils': '../bower_components/angular-ui-utils/ui-utils',
		bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
		'common/core': 'common/core.mock',
		'rx.angular': '../bower_components/angular-rx/rx.angular'
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
		'rx.angular': [ 'angular', 'rx' ],
	}
});

require([
	'common/main',
	'angular',
	'angular.route',
	'bootstrap'
], function () { });