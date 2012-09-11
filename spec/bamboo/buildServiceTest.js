define([
		'bamboo/buildService',
		'bamboo/bambooPlan',
		'bamboo/bambooRequest',
		'timer',
		'jquery',
		'signals',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json'
	],
	function (BuildService, BambooPlan, BambooRequest, Timer, $, signals, jasmineSignals, projectsJson) {

		'use strict';
		
		describe('bamboo/BuildService', function () {

			var service;
			var settings;
			var mockBambooRequestProjects;
			var mockBambooPlanUpdate;
			var mockTimer;
			var updateSuccessSignal;
			var updateErrorSignal;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			
			beforeEach(function () {
				settings = {
					name: 'My Bamboo CI',
					username: null,
					password: null,
					url: 'http://example.com/',
					updateInterval: 10000,
					projects: ['PROJECT1-PLAN1', 'PROJECT2-PLAN2']
				};
				service = new BuildService(settings);
				mockBambooRequestProjects = spyOn(BambooRequest.prototype, 'projects').andCallFake(function () {
					this.on.responseReceived.dispatch(projectsJson);
				});
				mockBambooPlanUpdate = spyOn(BambooPlan.prototype, 'update').andCallFake(function () {
					var finishedUpdate = new signals.Signal();
					finishedUpdate.memorize = true;
					finishedUpdate.dispatch();
					return finishedUpdate;
				});
				mockTimer = spyOn(Timer.prototype, 'start');
				updateSuccessSignal = new signals.Signal();
				updateSuccessSignal.memorize = true;
				updateSuccessSignal.dispatch(true, {});
				updateErrorSignal = new signals.Signal();
				updateErrorSignal.memorize = true;
				updateErrorSignal.dispatch(false, { message: 'error message' });
			});

			it('should provide default settings', function () {
				var settings = BuildService.settings();

				expect(settings.typeName).toBe('Atlassian Bamboo');
				expect(settings.baseUrl).toBe('bamboo');
				expect(settings.icon).toBe('bamboo/icon.png');
				expect(settings.projects.length).toBe(0);
			});

			it('should expose service interface', function () {
				expect(service.name).toBe(settings.name);
				expect(service.on.brokenBuild).toBeDefined();
				expect(service.on.fixedBuild).toBeDefined();
				expect(service.on.errorThrown).toBeDefined();
				expect(service.on.updating).toBeDefined();
				expect(service.on.updated).toBeDefined();
			});

			describe('initialize', function () {

				it('should initialize plans on start', function () {
					service.start();

					expect(mockBambooRequestProjects).toHaveBeenCalled();
					expect(service.isInitialized).toBe(true);
					expect(service.plans['PROJECT1-PLAN1']).toBeDefined();
					expect(service.plans['PROJECT2-PLAN2']).toBeDefined();
				});

				it('should re-initialize plans on restart', function () {
					service.start();
					expect(service.isInitialized).toBe(true);
					service.stop();
					expect(service.isInitialized).toBe(false);
					service.start();
					expect(service.isInitialized).toBe(true);

					expect(service.plans['PROJECT1-PLAN1']).toBeDefined();
					expect(service.plans['PROJECT2-PLAN2']).toBeDefined();
				});

				it('should signal error if initialization request failed', function () {
					var errorThrownSpy = spyOnSignal(service.on.errorThrown);
					mockBambooRequestProjects.andCallFake(function () {
						this.on.errorReceived.dispatch({ message: 'error message' });
					});

					service.start();

					expect(errorThrownSpy).toHaveBeenDispatched(1);
				});

				it('should signal error if initialization request parsing failed', function () {
					var errorThrownSpy = spyOnSignal(service.on.errorThrown);
					mockBambooRequestProjects.andCallFake(function () {
						this.on.errorReceived.dispatch({ message: 'error message' });
					});

					service.start();

					expect(errorThrownSpy).toHaveBeenDispatched(1);
				});

				it('should try again if initialize failed', function () {
					var attempt = 0;
					mockTimer.andCallFake(function () {
						if (attempt <= 1) {
							this.on.elapsed.dispatch();
						}
					});
					mockBambooRequestProjects.andCallFake(function () {
						attempt++;
						if (attempt <= 1) {
							this.on.errorReceived.dispatch({ message: 'ajax error' });
						} else {
							this.on.responseReceived.dispatch(projectsJson);
						}
					});
					var updatedSpy = spyOnSignal(service.on.updated);

					service.start();

					expect(updatedSpy).toHaveBeenDispatched(2);
					expect(service.isInitialized).toBe(true);
					expect(mockBambooRequestProjects.callCount).toBe(2);
					expect(mockBambooPlanUpdate).toHaveBeenCalled();
					expect(mockTimer).toHaveBeenCalled();
				});

				it('should update after initialized', function () {
					service.start();

					expect(mockBambooPlanUpdate).toHaveBeenCalled();
				});

				it('should signal brokenBuild when any build failed on first update', function () {
					var brokenBuildSpy = spyOnSignal(service.on.brokenBuild);
					mockBambooPlanUpdate.andCallFake(function () {
						this.on.failed.dispatch(this);
						return updateSuccessSignal;
					});

					service.start();

					expect(brokenBuildSpy).toHaveBeenDispatched(settings.projects.length);
				});

			});

			function initializeService() {
				service.initialize();
				service.isInitialized = true;
			}

			it('should not start if update interval not set', function () {
				var service1 = new BuildService({
					name: 'My Bamboo CI',
					username: null,
					password: null,
					url: 'http://example.com/'
				});

				expect(function () { service1.start(); }).toThrow();
			});

			it('should signal updated when all plan updates finished', function () {
				initializeService();
				var updatedSpy = spyOnSignal(service.on.updated);
				mockBambooPlanUpdate.andReturn(updateSuccessSignal);

				service.update();

				expect(updatedSpy).toHaveBeenDispatched(1);
			});
			
			it('should signal updated when no plans selected', function () {
				settings.projects = [];
				service = new BuildService(settings);
				initializeService();
				var updatedSpy = spyOnSignal(service.on.updated);
				mockBambooPlanUpdate.andReturn(updateSuccessSignal);

				service.update();

				expect(updatedSpy).toHaveBeenDispatched(1);
			});

			it('should signal updated when all plan updates finished with error', function () {
				initializeService();
				var updatedSpy = spyOnSignal(service.on.updated);
				mockBambooPlanUpdate.andReturn(updateErrorSignal);

				service.update();

				expect(updatedSpy).toHaveBeenDispatched(1);
			});

			it('should not signal updated when some plans still not finished', function () {
				initializeService();
				var updatedSpy = spyOnSignal(service.on.updated);
				var plansUpdated = 0;
				mockBambooPlanUpdate.andCallFake(function () {
					plansUpdated++;
					expect(updatedSpy).not.toHaveBeenDispatched();
					return updateSuccessSignal;
				});

				service.update();

				expect(updatedSpy).toHaveBeenDispatched(1);
			});

			it('should signal errorThrown if plan update failed', function () {
				initializeService();
				var errorThrownSpy = spyOnSignal(service.on.errorThrown);
				mockBambooPlanUpdate.andCallFake(function () {
					this.on.errorThrown.dispatch({ message: 'ajax error' });
					return updateErrorSignal;
				});

				service.update();

				expect(errorThrownSpy).toHaveBeenDispatched(settings.projects.length);
			});


			it('should update plans', function () {
				initializeService();

				service.update();

				expect(mockBambooPlanUpdate).toHaveBeenCalled();
			});

			it('should update until stopped', function () {
				mockTimer.andCallFake(function () {
					this.on.elapsed.dispatch();
				});
				var updatingSpy = spyOnSignal(service.on.updating).matching(function () {
					if (this.count > 2) {
						service.stop();
						return false;
					}
					return true;
				});

				service.start();

				expect(updatingSpy).toHaveBeenDispatched(3);
			});

			it('multiple services should update independently', function () {
				initializeService();
				var service1 = new BuildService({ name: 'Bamboo', url: 'http://example1.com/', projects: [] });
				var updatingSpy1 = spyOnSignal(service1.on.updating);
				var service2 = new BuildService({ name: 'Bamboo', url: 'http://example2.com/', projects: [] });
				var updatingSpy2 = spyOnSignal(service2.on.updating);

				service1.update();
				service2.update();

				expect(updatingSpy1).toHaveBeenDispatched(1);
				expect(updatingSpy2).toHaveBeenDispatched(1);
			});

			it('should signal brokenBuild if plan signaled', function () {
				initializeService();
				var brokenBuildSpy = spyOnSignal(service.on.brokenBuild);
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.on.failed.dispatch(plan);

				expect(brokenBuildSpy).toHaveBeenDispatched(1);
			});

			it('should signal fixedBuild if plan signaled', function () {
				initializeService();
				var fixedBuildSpy = spyOnSignal(service.on.fixedBuild);
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.on.fixed.dispatch(plan);

				expect(fixedBuildSpy).toHaveBeenDispatched(1);
			});

			it('should ignore disabled plans', function () {
				settings = {
					name: 'My Bamboo CI',
					url: 'http://example.com/',
					projects: ['PROJECT1-PLAN1', 'PROJECT1-PLAN2']
				};
				service = new BuildService(settings);

				service.update();

				expect(mockBambooPlanUpdate.callCount).toBe(1);
			});

			describe('projects', function () {

				it('should use url and credentials when getting available projects', function () {
					mockBambooRequestProjects.andCallFake(function () {
						expect(this.settings.username).toBe(settings.username);
						expect(this.settings.password).toBe(settings.password);
						expect(this.settings.url).toBe(settings.url);
						this.on.responseReceived.dispatch(projectsJson);
					});
					
					service.projects([]);

					expect(mockBambooRequestProjects).toHaveBeenCalled();
				});

			});

			describe('activeProjects', function () {

				it('should return service name', function () {
					var result = service.activeProjects();

					expect(result.name).toBe(settings.name);
				});

				it('should return empty if no projects monitored', function () {
					var result = service.activeProjects();

					expect(result.items.length).toBe(0);
				});

				it('should return item name', function () {
					service.update();

					var result = service.activeProjects();

					expect(result.items[0].name).toBe('Plan 1');
					expect(result.items[1].name).toBe('Plan 2');
				});

				it('should return group name', function () {
					service.update();

					var result = service.activeProjects();

					expect(result.items[0].group).toBe('Project 1');
					expect(result.items[1].group).toBe('Project 2');
				});

			});
		});
	});