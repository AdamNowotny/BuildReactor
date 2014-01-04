define([
	'common/core',
	'common/coreLogger',
	'angular',
	'popup/app',
	'popup/routes',
	'popup/controller'
], function (core, logger, angular) {
	'use strict';

	core.init();
	logger();

	angular.element(document).ready(function () {
		angular.bootstrap(document, ['popup']);
	});
});
