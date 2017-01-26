import events from 'core/events';
import handler from 'core/passwordExpiredHandler';
import serviceConfiguration from 'core/config/serviceConfiguration';

describe('core/passwordExpiredHandler', () => {

	beforeEach(() => {
		events.reset();
		handler.init();
		spyOn(serviceConfiguration, 'disableService');
	});

	it('should disable service when password expired', () => {
		events.push({ eventName: 'passwordExpired', details: {}, source: 'service name' });

		expect(serviceConfiguration.disableService).toHaveBeenCalledWith('service name');
	});

	it('should not disable service if event is not passwordExpired', () => {
		events.push({ eventName: 'buildBroken', details: {}, source: 'service name' });

		expect(serviceConfiguration.disableService).not.toHaveBeenCalled();
	});

});
