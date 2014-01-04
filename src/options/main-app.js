define([
	'options/optionsController',
	'common/core',
	'common/coreLogger'
], function (optionsController, core, logger) {

	'use strict';

	logger();
	core.initOptions(function (response) {
		optionsController.initialize(response.serviceTypes);
		optionsController.load(response.settings);
	});
});
