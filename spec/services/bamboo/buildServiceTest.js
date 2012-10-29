define([
		'services/bamboo/buildService',
		'services/bamboo/bambooPlan',
		'services/bamboo/bambooRequest',
		'common/timer',
		'jquery',
		'signals',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json'
	],
	function (BuildService, BambooPlan, BambooRequest, Timer, $, signals, jasmineSignals, projectsJson) {

		'use strict';
		
		describe('services/bamboo/BuildService', function () {

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
					switch (this.key) {
					case 'PROJECT1-PLAN1':
						this.projectName = 'Project 1';
						this.name = 'Plan 1';
						break;
					case 'PROJECT2-PLAN2':
						this.projectName = 'Project 2';
						this.name = 'Plan 2';
						break;
					}
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
				expect(settings.urlHint).toBe('https://ci.openmrs.org/');
			});

			it('should expose service interface', function () {
				expect(service.name).toBe(settings.name);
				expect(service.on.brokenBuild).toBeDefined();
				expect(service.on.fixedBuild).toBeDefined();
				expect(service.on.errorThrown).toBeDefined();
				expect(service.on.updating).toBeDefined();
				expect(service.on.updated).toBeDefined();
			});

			it('should update plans on start', function () {
				service.start();

				expect(mockBambooPlanUpdate).toHaveBeenCalled();
				expect(service.plans['PROJECT1-PLAN1']).toBeDefined();
				expect(service.plans['PROJECT2-PLAN2']).toBeDefined();
			});

			describe('initialize', function () {


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
				var updatedSpy = spyOnSignal(service.on.updated);
				mockBambooPlanUpdate.andReturn(updateSuccessSignal);

				service.update();

				expect(updatedSpy).toHaveBeenDispatched(1);
			});
			
			it('should signal updated when no plans selected', function () {
				settings.projects = [];
				service = new BuildService(settings);
				var updatedSpy = spyOnSignal(service.on.updated);
				mockBambooPlanUpdate.andReturn(updateSuccessSignal);

				service.update();

				expect(updatedSpy).toHaveBeenDispatched(1);
			});

			it('should signal updated when all plan updates finished with error', function () {
				spyOnSignal(service.on.updated);
				mockBambooPlanUpdate.andReturn(updateErrorSignal);

				service.update();

				expect(service.on.updated).toHaveBeenDispatched(1);
			});

			it('should not signal updated when some plans still not finished', function () {
				spyOnSignal(service.on.updated);
				var plansUpdated = 0;
				mockBambooPlanUpdate.andCallFake(function () {
					plansUpdated++;
					expect(service.on.updated).not.toHaveBeenDispatched();
					return updateSuccessSignal;
				});

				service.update();

				expect(service.on.updated).toHaveBeenDispatched(1);
			});

			it('should signal errorThrown if plan update failed', function () {
				spyOnSignal(service.on.errorThrown);
				mockBambooPlanUpdate.andCallFake(function () {
					this.on.errorThrown.dispatch({ message: 'ajax error' });
					return updateErrorSignal;
				});

				service.update();

				expect(service.on.errorThrown).toHaveBeenDispatched(settings.projects.length);
			});


			it('should update plans', function () {
				service.update();

				expect(mockBambooPlanUpdate).toHaveBeenCalled();
			});

			it('should update until stopped', function () {
				mockTimer.andCallFake(function () {
					this.on.elapsed.dispatch();
				});
				spyOnSignal(service.on.updating).matching(function () {
					if (this.count > 2) {
						service.stop();
						return false;
					}
					return true;
				});

				service.start();

				expect(service.on.updating).toHaveBeenDispatched(3);
			});

			it('multiple services should update independently', function () {
				var service1 = new BuildService({ name: 'Bamboo', url: 'http://example1.com/', projects: [] });
				var service2 = new BuildService({ name: 'Bamboo', url: 'http://example2.com/', projects: [] });
				spyOnSignal(service1.on.updating);
				spyOnSignal(service2.on.updating);

				service1.update();
				service2.update();

				expect(service1.on.updating).toHaveBeenDispatched(1);
				expect(service2.on.updating).toHaveBeenDispatched(1);
			});

			it('should signal brokenBuild if plan signaled', function () {
				spyOnSignal(service.on.brokenBuild);
				service.update();
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.on.failed.dispatch(plan);

				expect(service.on.brokenBuild).toHaveBeenDispatched(1);
			});

			it('should signal fixedBuild if plan signaled', function () {
				spyOnSignal(service.on.fixedBuild);
				service.update();
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.on.fixed.dispatch(plan);

				expect(service.on.fixedBuild).toHaveBeenDispatched(1);
			});

			it('should signal startedBuild if plan signaled', function () {
				spyOnSignal(service.on.startedBuild);
				service.update();
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.on.started.dispatch(plan);

				expect(service.on.startedBuild).toHaveBeenDispatched(1);
			});

			it('should signal finishedBuild if plan signaled', function () {
				spyOnSignal(service.on.finishedBuild);
				service.update();
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.on.finished.dispatch(plan);

				expect(service.on.finishedBuild).toHaveBeenDispatched(1);
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

				it('should return available projects', function () {
					var response;

					service.projects([]).addOnce(function (result) {
						response = result;
					});

					expect(response.error).not.toBeDefined();
					expect(response.projects).toBeDefined();
				});

				it('should return error', function () {
					mockBambooRequestProjects.andCallFake(function () {
						this.on.errorReceived.dispatch({ message: 'error message' });
					});
					var response;

					service.projects([]).addOnce(function (result) {
						response = result;
					});

					expect(response.error).toBeDefined();
					expect(response.projects).not.toBeDefined();
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

				it('should indicate if broken', function () {
					service.update();

					service.plans['PROJECT1-PLAN1'].state = 'Failed';
					var result = service.activeProjects();

					expect(result.items[0].isBroken).toBeTruthy();
				});

				it('should indicate if building', function () {
					service.update();

					service.plans['PROJECT1-PLAN1'].isBuilding = true;
					var result = service.activeProjects();

					expect(result.items[0].isBuilding).toBeTruthy();
				});

				it('should render link', function () {
					service.update();

					service.plans['PROJECT1-PLAN1'].url = 'http://example.com/plan1';
					var result = service.activeProjects();

					expect(result.items[0].url).toBe('http://example.com/plan1');
				});

			});
		});
	});