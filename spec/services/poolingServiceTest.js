define(['services/poolingService', 'common/timer', 'jasmineSignals'], function (PoolingService, Timer, jasmineSignals) {

	'use strict';

	describe('start', function () {

		var service;
		var settings;
		var spyOnSignal = jasmineSignals.spyOnSignal;

		beforeEach(function () {
			settings = {
				name: 'My CI',
				username: null,
				password: null,
				url: 'http://example.com/',
				updateInterval: 10000,
				projects: ['build1', 'build2']
			};
			service = new PoolingService(settings);
		});

		it('should expose service interface', function () {
			expect(service.name).toBe(settings.name);
			expect(service.on.brokenBuild).toBeDefined();
			expect(service.on.fixedBuild).toBeDefined();
			expect(service.on.errorThrown).toBeDefined();
			expect(service.on.updating).toBeDefined();
			expect(service.on.updated).toBeDefined();
		});

		it('should update on start', function () {
			spyOn(service, 'update');

			service.start();

			expect(service.update).toHaveBeenCalled();
		});

		it('should not start if update interval not set', function () {
			var service1 = new PoolingService({
				name: 'My CI',
				updateInterval: undefined,
				url: 'http://example.com/'
			});

			expect(function () { service1.start(); }).toThrow();
		});

		it('should update after previous finished', function () {
			spyOn(service, 'update');
			spyOn(Timer.prototype, 'start').andCallFake(function () {
				this.on.elapsed.dispatch();
			});

			service.start();

			service.on.updated.dispatch();
			service.on.updated.dispatch();

			expect(service.update.callCount).toBe(3);
		});

		it('should update until stopped', function () {
			var updates = 0;
			spyOn(service, 'update').andCallFake(function () {
				updates++;
				if (updates > 2) {
					service.stop();
				}
				this.on.updated.dispatch();
			});
			spyOn(Timer.prototype, 'start').andCallFake(function () {
				this.on.elapsed.dispatch();
			});

			service.start();

			expect(service.update.callCount).toBe(3);
		});

		it('should not update if stopped', function () {
			spyOn(service, 'update').andCallFake(function () {
				service.on.updated.dispatch();
			});
			var elapsed;
			spyOn(Timer.prototype, 'start').andCallFake(function () {
				elapsed = this.on.elapsed;
			});
			service.start();

			service.stop();
			elapsed.dispatch();
			elapsed.dispatch();

			expect(service.update.callCount).toBe(1);
		});

	});
});