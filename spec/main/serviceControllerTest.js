define([
		'jquery',
		'main/serviceController',
		'main/serviceRepository',
		'spec/mocks/buildService',
		'spec/mocks/mockBuildEvent',
		'spec/mocks/mockSettingsBuilder',
		'mout/string/endsWith',
		'signals',
		'jasmineSignals'
	],
	function ($, controller, serviceRepository, MockBuildService, mockBuildEvent, MockSettingsBuilder, endsWith, Signal, spyOnSignal) {

		'use strict';
		
		describe('ServiceController', function () {

			beforeEach(function () {
				controller.load([]);
			});

			describe('service interface', function () {

				it('should require settings', function () {
					var service = new MockBuildService();
					delete service.settings;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require brokenBuild signal', function () {
					var service = new MockBuildService();
					delete service.on.brokenBuild;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require fixedBuild signal', function () {
					var service = new MockBuildService();
					delete service.on.fixedBuild;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require updating signal', function () {
					var service = new MockBuildService();
					delete service.on.updating;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require updated signal', function () {
					var service = new MockBuildService();
					delete service.on.updated;
					
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

				expect(mockService.on.brokenBuild.getNumListeners()).toBe(0);
				expect(mockService.on.fixedBuild.getNumListeners()).toBe(0);
				expect(mockService.on.updating.getNumListeners()).toBe(0);
				expect(mockService.on.updated.getNumListeners()).toBe(0);
				expect(mockService.on.errorThrown.getNumListeners()).toBe(0);
			});

			it('should remove all services when empty settings passed', function () {
				var mockService1 = new MockBuildService();
				var mockService2 = new MockBuildService();
				controller.addService(mockService1);
				controller.addService(mockService2);

				controller.load([]);

				expect(controller.services.length).toBe(0);
			});

			it('should signal brokenBuild on build failure', function () {
				var buildFailedSpy = spyOnSignal(controller.on.brokenBuild);
				var mockService = new MockBuildService();
				controller.addService(mockService);

				mockService.on.brokenBuild.dispatch(mockBuildEvent());

				expect(buildFailedSpy).toHaveBeenDispatched(1);
			});

			it('should signal fixedBuild on build fixed event', function () {
				var buildFixedSpy = spyOnSignal(controller.on.fixedBuild);
				var mockService = new MockBuildService();
				controller.addService(mockService);

				mockService.on.fixedBuild.dispatch(mockBuildEvent());

				expect(buildFixedSpy).toHaveBeenDispatched(1);
			});

			it('should signal when all services are loaded', function () {
				var settings1 = new MockSettingsBuilder().create();
				var settings2 = new MockSettingsBuilder().create();
				var createdSignal = new Signal();
				createdSignal.memorize = true;
				createdSignal.dispatch(new MockBuildService());
				spyOn(serviceRepository, 'create').andReturn(createdSignal);
				var loaded = false;

				controller.load([settings1, settings2]).addOnce(function () {
					loaded = true;
				});

				expect(loaded).toBeTruthy();
			});

			it('should signal loaded when no services configured', function () {
				var loaded = false;

				controller.load([]).addOnce(function () {
					loaded = true;
				});

				expect(loaded).toBeTruthy();
			});

			it('should notifiy when services are reloaded', function () {
				spyOnSignal(controller.on.reloading);

				controller.load([]);

				expect(controller.on.reloading).toHaveBeenDispatched(1);
			});

			it('should not load disabled services', function () {
				spyOn(serviceRepository, 'create');
				var settings = new MockSettingsBuilder().isDisabled().create();

				controller.load([settings]);

				expect(serviceRepository.create).not.toHaveBeenCalled();
			});

			it('should signal loaded if services disabled', function () {
				var settings = new MockSettingsBuilder().isDisabled().create();
				var loaded = false;

				controller.load([settings]).addOnce(function () {
					loaded = true;
				});

				expect(loaded).toBe(true);
			});

			describe('run', function () {

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

				it('should dispatch started when service finishes update', function () {
					var startedSpy = spyOnSignal(controller.on.started);
					var mockService = new MockBuildService();

					controller.addService(mockService);
					controller.run();
					mockService.on.updated.dispatch();

					expect(startedSpy).toHaveBeenDispatched();
				});

				it('should not dispatch started before service finishes update', function () {
					var startedSpy = spyOnSignal(controller.on.started);
					var mockService = new MockBuildService();

					controller.addService(mockService);
					controller.run();

					expect(startedSpy).not.toHaveBeenDispatched();
				});

				it('should dispatch startedAll when all services finish update', function () {
					var startedAllSpy = spyOnSignal(controller.on.startedAll);
					var mockService1 = new MockBuildService();
					var mockService2 = new MockBuildService();

					controller.addService(mockService1);
					controller.addService(mockService2);
					controller.run();
					mockService1.on.updated.dispatch();
					mockService2.on.updated.dispatch();

					expect(startedAllSpy).toHaveBeenDispatched();
				});

				it('should not dispatch startedAll before all services finish update', function () {
					spyOnSignal(controller.on.startedAll);
					var mockService1 = new MockBuildService();
					var mockService2 = new MockBuildService();

					controller.addService(mockService1);
					controller.addService(mockService2);
					controller.run();
					mockService1.on.updated.dispatch();

					expect(controller.on.startedAll).not.toHaveBeenDispatched();
				});

				it('should signal startedAll if no services configured', function () {
					spyOnSignal(controller.on.startedAll);

					controller.run();

					expect(controller.on.startedAll).toHaveBeenDispatched();
				});

				it('should signal startedAll even if services disabled', function () {
					spyOnSignal(controller.on.startedAll);
					var settings = new MockSettingsBuilder().isDisabled().create();

					controller.load([settings]);
					controller.run();

					expect(controller.on.startedAll).toHaveBeenDispatched();
				});

			});

			it('should get project state from all services', function () {
				var mockService1 = new MockBuildService();
				var mockService2 = new MockBuildService();
				var projects1 = { name: 'service 1' };
				var projects2 = { name: 'service 2' };
				spyOn(mockService1, 'activeProjects').andReturn(projects1);
				spyOn(mockService2, 'activeProjects').andReturn(projects2);
				controller.addService(mockService1);
				controller.addService(mockService2);

				var projects = controller.activeProjects();

				expect(projects.length).toBe(2);
				expect(projects[0]).toBe(projects1);
				expect(projects[1]).toBe(projects2);
			});

		});
	});