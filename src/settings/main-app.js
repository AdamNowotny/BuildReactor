define([
	'common/core',
	'common/coreLogger',
	'angular',
	'settings/app',
	'settings/controller',
	'settings/routes',
	'settings/serviceSettingsCtrl',
	'settings/addServiceCtrl',
	'settings/directives/focusIf/focusIf',
	'settings/directives/serviceNamePanel/serviceNamePanel',
	'settings/directives/sidebar/sidebar',
	'settings/directives/thumbnails/thumbnails'
], function (core, logger, angular) {

	'use strict';

	logger();
	core.init();
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['settings']);
	});

});
