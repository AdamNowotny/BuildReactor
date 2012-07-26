define([
		'jquery',
		'serviceController',
		'spec/mocks/mockBuildService',
		'spec/mocks/mockBuildEvent',
		'spec/mocks/mockSettingsBuilder',
		'amdUtils/string/endsWith',
		'jasmineSignals'
	],
	function ($, controller, MockBuildService, mockBuildEvent, MockSettingsBuilder, endsWith, jasmineSignals) {

		'use strict';
		
		describe('ServiceController', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;
			
			beforeEach(function () {
				controller.load([]);
			});

			describe('service interface', function () {

				it('should require name', function () {
					var service = new MockBuildService();
					service.name = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require buildFailed signal', function () {
					var service = new MockBuildService();
					service.buildFailed = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require buildFixed signal', function () {
					var service = new MockBuildService();
					service.buildFixed = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require updateStarted signal', function () {
					var service = new MockBuildService();
					service.updateStarted = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require updateFinished signal', function () {
					var service = new MockBuildService();
					service.updateFinished = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require errorThrown signal', function () {
					var service = new MockBuildService();
					service.errorThrown = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

			});

			it('should throw exception if removing service that has not been added', function () {
				var mockService = new MockBuildService();

				expect(function () { controller.removeService(mockService); }).toThrow();
			});

			it('should stop on service removed', function () {
				var mockService = new MockBuildService();
				spyOn(mockService, 'stop');

				controller.addService(mockService);
				controller.removeService(mockService);

				expect(mockService.stop).toHaveBeenCalled();
			});

			it('should unsubscribe from signals on service removed', function () {
				var mockService = new MockBuildService();

				controller.addService(mockService);
				controller.removeService(mockService);

				expect(mockService.buildFailed.getNumListeners()).toBe(0);
				expect(mockService.buildFixed.getNumListeners()).toBe(0);
				expect(mockService.updateFinished.getNumListeners()).toBe(0);
				expect(mockService.updateStarted.getNumListeners()).toBe(0);
				expect(mockService.errorThrown.getNumListeners()).toBe(0);
			});

			it('should remove all services when empty settings passed', function () {
				var mockService1 = new MockBuildService();
				var mockService2 = new MockBuildService();
				controller.addService(mockService1);
				controller.addService(mockService2);

				controller.load([]);

				expect(controller.services.length).toBe(0);
			});

			it('should start all services', function () {
				var mockService1 = new MockBuildService();
				var mockService2 = new MockBuildService();
				spyOn(mockService1, 'start');
				spyOn(mockService2, 'start');
				controller.addService(mockService1);
				controller.addService(mockService2);

				controller.run();

				expect(mockService1.start).toHaveBeenCalled();
				expect(mockService2.start).toHaveBeenCalled();
			});

			it('should signal buildFailed on build failure', function () {
				var buildFailedSpy = spyOnSignal(controller.buildFailed);
				var mockService = new MockBuildService();
				controller.addService(mockService);

				mockService.buildFailed.dispatch(mockBuildEvent());

				expect(buildFailedSpy).toHaveBeenDispatched(1);
			});

			it('should signal buildFixed on build fixed event', function () {
				var buildFixedSpy = spyOnSignal(controller.buildFixed);
				var mockService = new MockBuildService();
				controller.addService(mockService);

				mockService.buildFixed.dispatch(mockBuildEvent());

				expect(buildFixedSpy).toHaveBeenDispatched(1);
			});

			it('should run services only after all are loaded', function () {
				var servicesStartedSpy = spyOnSignal(controller.servicesStarted);
				var settings1 = new MockSettingsBuilder().withName('service 1').withBaseUrl('service1').create();
				var settings2 = new MockSettingsBuilder().withName('service 2').withBaseUrl('service2').create();
				var loaded1callback;
				var loaded2callback;
				spyOn(window, 'require').andCallFake(function (serviceNames, callback) {
					if (endsWith(serviceNames[0], 'service1/buildService')) {
						loaded1callback = callback;
					} else if (endsWith(serviceNames[0], 'service2/buildService')) {
						loaded2callback = callback;
					} else {
						throw 'Service unknown: ' + serviceNames[0];
					}
				});

				controller.load([settings1, settings2]);
				controller.run();

				expect(servicesStartedSpy).not.toHaveBeenDispatched();
				loaded1callback(MockBuildService);
				expect(servicesStartedSpy).not.toHaveBeenDispatched();
				loaded2callback(MockBuildService);
				expect(servicesStartedSpy).toHaveBeenDispatched(1);
			});

			it('should notifiy when services are reloaded', function () {
				var startedLoadingSpy = spyOnSignal(controller.startedLoading);

				controller.load([]);

				expect(startedLoadingSpy).toHaveBeenDispatched(1);
			});

		});
	});