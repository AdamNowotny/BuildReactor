define([
		'services/bamboo/buildService',
		'services/bamboo/bambooPlan',
		'services/bamboo/bambooRequest',
		'jquery',
		'rx',
		'services/request',
		'json!spec/fixtures/bamboo/projects.json'
	],
	function (BuildService, BambooPlan, BambooRequest, $, Rx, request, projectsJson) {

		'use strict';

		describe('services/bamboo/BuildService', function () {

			var service;
			var settings;

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

			describe('availableBuilds', function () {

				it('should return available projects', function () {
					var rxJson = Rx.Observable.never();
					spyOn(request, 'json').andReturn(rxJson);

					var response = service.availableBuilds();

					expect(response).toBe(rxJson);
				});

				it('should pass options to request', function () {
					spyOn(request, 'json').andCallFake(function (options) {
						expect(options.username).toBe(settings.username);
						expect(options.password).toBe(settings.password);
						expect(options.url).toBe('http://example.com/rest/api/latest/project?expand=projects.project.plans.plan');
						expect(options.authCookie).toBe('JSESSIONID');
					});

					service.availableBuilds();

					expect(request.json).toHaveBeenCalled();
				});

				it('should parse response', function () {
					spyOn(request, 'json').andCallFake(function (options) {
						var response = options.parser(projectsJson);
						expect(response.items.length).toBe(5);
						expect(response.items[0].id).toBe('PROJECT1-PLAN1');
						expect(response.items[0].name).toBe('Plan 1');
						expect(response.items[0].group).toBe('Project 1');
						expect(response.items[0].isDisabled).toBe(false);
					});

					service.availableBuilds();

					expect(request.json).toHaveBeenCalled();
				});

			});

		});
	});