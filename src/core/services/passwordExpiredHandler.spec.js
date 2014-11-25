define([
	'core/services/passwordExpiredHandler',
	'core/services/serviceController',
	'core/config/serviceConfiguration'
], function (handler, serviceController, serviceConfiguration) {

	'use strict';

	describe('core/services/passwordExpiredHandler', function () {

		beforeEach(function () {
			spyOn(serviceConfiguration, 'disableService');
		});

		it('should disable service when password expired', function () {
			serviceController.events.onNext({ eventName: 'passwordExpired', details: {}, source: 'service name' });

			expect(serviceConfiguration.disableService).toHaveBeenCalledWith('service name');
		});

		it('should not disable service if event is not passwordExpired', function () {
			serviceController.events.onNext({ eventName: 'buildBroken', details: {}, source: 'service name' });

			expect(serviceConfiguration.disableService).not.toHaveBeenCalled();
		});

	});
});