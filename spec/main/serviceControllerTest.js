define([
		'jquery',
		'main/serviceController',
		'common/resourceFinder',
		'spec/mocks/buildService',
		'spec/mocks/mockBuildEvent',
		'spec/mocks/mockSettingsBuilder',
		'amdUtils/string/endsWith',
		'jasmineSignals'
	],
	function ($, controller, resourceFinder, MockBuildService, mockBuildEvent, MockSettingsBuilder, endsWith, jasmineSignals) {

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

				it('should require brokenBuild signal', function () {
					var service = new MockBuildService();
					service.on.brokenBuild = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require fixedBuild signal', function () {
					var service = new MockBuildService();
					service.on.fixedBuild = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require updating signal', function () {
					var service = new MockBuildService();
					service.on.updating = undefined;
					
					expect(function () { controller.addService(service); }).toThrow();
				});

				it('should require updated signal', function () {
					var service = new MockBuildService();
					service.on.updated = undefined;
					
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
				var loaded = false;
				spyOn(resourceFinder, 'service').andReturn('spec/mocks/buildService');

				runs(function () {
					controller.load([settings1, settings2]).addOnce(function () {
						loaded = true;
					});
				});

				waitsFor(function () {
					return loaded;
				});
			});

			it('should signal loaded when no services configured', function () {
				var loaded = false;

				runs(function () {
					controller.load([]).addOnce(function () {
						loaded = true;
					});
				});

				waitsFor(function () {
					return loaded;
				});
			});

			it('should notifiy when services are reloaded', function () {
				var resetSpy = spyOnSignal(controller.on.reset);

				controller.load([]);

				expect(resetSpy).toHaveBeenDispatched(1);
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
					var startedAllSpy = spyOnSignal(controller.on.startedAll);
					var mockService1 = new MockBuildService();
					var mockService2 = new MockBuildService();

					controller.addService(mockService1);
					controller.addService(mockService2);
					controller.run();
					mockService1.on.updated.dispatch();

					expect(startedAllSpy).not.toHaveBeenDispatched();
				});

				it('should signal startedAll if no services configured', function () {
					var startedAllSpy = spyOnSignal(controller.on.startedAll);

					controller.run();

					expect(startedAllSpy).toHaveBeenDispatched();
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