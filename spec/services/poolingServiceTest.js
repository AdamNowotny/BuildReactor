define([
	'services/poolingService',
	'common/timer',
	'signals',
	'jasmineSignals'
], function (PoolingService, Timer, Signal, spyOnSignal) {

	'use strict';

	describe('poolingService', function () {

		var service;
		var settings;

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

		it('should provide pooling api', function () {
			expect(service.start).toBeDefined();
			expect(service.stop).toBeDefined();
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

		describe('update', function () {

			var completed;

			beforeEach(function () {
				completed = new Signal();
				completed.memorize = true;
				service.updateAll = function () {
					return completed;
				};
			});

			it('should signal updating', function () {
				spyOnSignal(service.on.updating);

				service.update();

				expect(service.on.updating).toHaveBeenDispatched();
			});

			it('should signal updated when finished', function () {
				spyOnSignal(service.on.updated);
				completed.dispatch();

				service.update();

				expect(service.on.updated).toHaveBeenDispatched();
			});

			it('should not signal updated until finished', function () {
				spyOnSignal(service.on.updated);

				service.update();

				expect(service.on.updated).not.toHaveBeenDispatched();
			});

			it('multiple services should update independently', function () {
				var service1 = new PoolingService({ name: 'Bamboo', url: 'http://example1.com/', projects: [] });
				var service2 = new PoolingService({ name: 'Bamboo', url: 'http://example2.com/', projects: [] });
				spyOnSignal(service1.on.updating);
				spyOnSignal(service2.on.updating);
				service1.updateAll = function () { return completed; };
				service2.updateAll = function () { return completed; };

				service1.update();
				service2.update();
				service2.update();

				expect(service1.on.updating).toHaveBeenDispatched(1);
				expect(service2.on.updating).toHaveBeenDispatched(2);
			});

		});

	});
});