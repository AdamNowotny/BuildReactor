define([
		'services/bamboo/buildService',
		'services/bamboo/bambooPlan',
		'services/bamboo/bambooRequest',
		'common/timer',
		'services/poolingService',
		'jquery',
		'signals',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json'
	],
	function (BuildService, BambooPlan, BambooRequest, Timer, PoolingService, $, signals, spyOnSignal, projectsJson) {

		'use strict';
		
		describe('services/bamboo/BuildService', function () {

			var service;
			var settings;
			var mockBambooRequestProjects;
			var mockBambooPlanUpdate;
			var mockTimer;
			var updateSuccessSignal;
			var updateErrorSignal;
			
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
					switch (this.id) {
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
				spyOn(PoolingService.prototype, 'start');
				spyOn(PoolingService.prototype, 'stop');
				updateSuccessSignal = new signals.Signal();
				updateSuccessSignal.memorize = true;
				updateSuccessSignal.dispatch({ result: {} });
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
				expect(service.on.startedBuild).toBeDefined();
				expect(service.on.finishedBuild).toBeDefined();
			});

			describe('updateAll', function () {

				it('should update plans', function () {
					service.updateAll();

					expect(mockBambooPlanUpdate).toHaveBeenCalled();
					expect(mockBambooPlanUpdate.callCount).toBe(settings.projects.length);
				});

				it('should signal when all plan updates finished', function () {
					mockBambooPlanUpdate.andReturn(updateSuccessSignal);
					var completed = false;

					service.updateAll().addOnce(function () {
						completed = true;
					});

					expect(completed).toBe(true);
				});
				
				it('should signal when no plans selected', function () {
					settings.projects = [];
					mockBambooPlanUpdate.andReturn(updateSuccessSignal);
					service = new BuildService(settings);
					var completed = false;

					service.updateAll().addOnce(function () {
						completed = true;
					});

					expect(completed).toBe(true);
				});

				it('should signal updated when all plan updates finished with error', function () {
					mockBambooPlanUpdate.andReturn(updateErrorSignal);
					var completed = false;

					service.updateAll().addOnce(function () {
						completed = true;
					});

					expect(completed).toBe(true);
				});

				it('should not signal when some plans still not finished', function () {
					var plansUpdated = 0;
					mockBambooPlanUpdate.andCallFake(function () {
						plansUpdated++;
						expect(completed).toBe(false);
						return updateSuccessSignal;
					});
					var completed = false;

					service.updateAll().addOnce(function () {
						completed = true;
					});

					expect(completed).toBe(true);
				});
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

				it('should return project', function () {
					var response;

					service.projects([]).addOnce(function (result) {
						response = result;
					});

					expect(response.projects.items[0].id).toBe('PROJECT1-PLAN1');
					expect(response.projects.items[0].name).toBe('Plan 1');
					expect(response.projects.items[0].group).toBe('Project 1');
					expect(response.projects.items[0].enabled).toBe(true);
					expect(response.projects.items[0].selected).toBe(false);
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

		});
	});