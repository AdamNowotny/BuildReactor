define([
	'common/core',
	'common/coreLogger',
	'angular',
	'settings/app',
	'settings/routes',
	'settings/directives/thumbnails/thumbnails'
], function (core, logger, angular) {

	'use strict';

	logger();
	core.init();
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['settings']);
	});

});
