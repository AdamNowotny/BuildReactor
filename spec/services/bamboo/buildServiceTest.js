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
			var mockTimer;

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
				mockTimer = spyOn(Timer.prototype, 'start');
				spyOn(PoolingService.prototype, 'start');
				spyOn(PoolingService.prototype, 'stop');
			});

			it('should provide default settings', function () {
				var settings = BuildService.settings();

				expect(settings.typeName).toBe('Atlassian Bamboo');
				expect(settings.baseUrl).toBe('bamboo');
				expect(settings.icon).toBe('bamboo/icon.png');
				expect(settings.projects.length).toBe(0);
				expect(settings.urlHint).toBe('https://ci.openmrs.org/');
				expect(settings.url).toBeDefined();
				expect(settings.username).toBeDefined();
				expect(settings.password).toBeDefined();
				expect(settings.updateInterval).toBe(60);
			});

			it('should expose service interface', function () {
				expect(service.settings).toBe(settings);
				expect(service.on.brokenBuild).toBeDefined();
				expect(service.on.fixedBuild).toBeDefined();
				expect(service.on.errorThrown).toBeDefined();
				expect(service.on.updating).toBeDefined();
				expect(service.on.updated).toBeDefined();
				expect(service.on.startedBuild).toBeDefined();
				expect(service.on.finishedBuild).toBeDefined();
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

				it('should signal error if parsing the response fails', function () {
					mockBambooRequestProjects.andCallFake(function () {
						this.on.responseReceived.dispatch({ unknown: 'response' });
					});

					var response;
					service.projects([]).addOnce(function (result) {
						response = result;
					});

					expect(response.error).toBeDefined();
					expect(response.error.name).toBe('ParseError');
				});


			});

		});
	});