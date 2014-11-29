// RequireJS configuration in src/common/main.js

// files that will be compiled into common-ui/main.js
require([
	'angular',
	'angular.route',
	'bootstrap',
	'angular.ui',
	'angular.ui.utils',
	'htmlSortable',
	'common-ui/core',
	'common-ui/coreLogger',
	'common-ui/directives/buildList/buildList'
], function () { });
