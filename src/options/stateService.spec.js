define([
	'rx',
	'common/core',
	'options/optionsController',
	'options/stateService'
], function (Rx, core, optionsController) {

	'use strict';
	
	describe('stateService', function () {

		var service;

		beforeEach(module('options'));

		beforeEach(inject(function ($injector) {
			service = $injector.get('StateService');
			spyOn(core, 'enableService');
			spyOn(core, 'disableService');
		}));

		it('should update services if service disabled', function () {
			optionsController.currentServices.onNext({ name: 'service', disabled: false });
			service.disableService();

			expect(core.disableService).toHaveBeenCalledWith('service');
		});

		it('should update services if service enabled', function () {
			optionsController.currentServices.onNext({ name: 'service', disabled: true });
			service.enableService();

			expect(core.enableService).toHaveBeenCalledWith('service');
		});

	});
});