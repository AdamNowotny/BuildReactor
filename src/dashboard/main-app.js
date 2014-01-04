define([
	'common/core',
	'common/coreLogger',
	'angular',
	'dashboard/app',
	'dashboard/routes',
	'dashboard/controller'
], function (core, logger, angular) {

	'use strict';

	core.init();
	logger();
	
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['dashboard']);
	});
});
