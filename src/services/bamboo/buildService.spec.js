define([
		'services/bamboo/buildService',
		'services/bamboo/bambooPlan',
		'rx',
		'services/request',
		'rx.aggregates'
	],
	function (BuildService, BambooPlan, Rx, request) {

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
				expect(settings.urlHint).toBe('URL, e.g. https://ci.openmrs.org/');
				expect(settings.url).toBeDefined();
				expect(settings.username).toBeDefined();
				expect(settings.password).toBeDefined();
				expect(settings.updateInterval).toBe(60);
			});

			describe('availableBuilds', function () {

				var projectsJson, projectsJson2;

				beforeEach(function () {
					projectsJson = JSON.parse(readFixtures('src/services/bamboo/projects.fixture.json'));
					projectsJson2 = JSON.parse(readFixtures('src/services/bamboo/projects_page2.fixture.json'));
					spyOn(request, 'json').andCallFake(function (options) {
						switch (options.url) {
						case 'http://example.com/rest/api/latest/project?expand=projects.project.plans.plan&start-index=0':
							return Rx.Observable.returnValue(projectsJson);
						case 'http://example.com/rest/api/latest/project?expand=projects.project.plans.plan&start-index=1':
							return Rx.Observable.returnValue(projectsJson2);
						default:
							throw new Error('Unknown URL: ' + options.url);
						}
					});
				});

				it('should pass options to request', function () {
					request.json.andCallFake(function (options) {
						expect(options.username).toBe(settings.username);
						expect(options.password).toBe(settings.password);
						expect(options.url).toBe('http://example.com/rest/api/latest/project?expand=projects.project.plans.plan&start-index=0');
						expect(options.authCookie).toBe('JSESSIONID');
						return Rx.Observable.never();
					});

					service.availableBuilds();

					expect(request.json).toHaveBeenCalled();
				});

				it('should parse plans', function () {
					projectsJson.projects.size = 1;
					projectsJson.projects['max-result'] = 1;

					var plans;
					service.availableBuilds().subscribe(function (d) {
						plans = d;
					});

					expect(plans.items.length).toBe(5);
					expect(plans.items[0].id).toBe('PROJECT1-PLAN1');
					expect(plans.items[0].name).toBe('Plan 1');
					expect(plans.items[0].group).toBe('Project 1');
					expect(plans.items[0].isDisabled).toBe(false);
				});

				it('should parse plans when multiple requests required', function () {
					projectsJson.projects.size = 2;
					projectsJson.projects['max-result'] = 1;

					var plans;
					service.availableBuilds().subscribe(function (d) {
						plans = d;
					});

					expect(plans.items.length).toBe(6);
					expect(plans.items[5].id).toBe('PROJECT3-PLAN1');
					expect(plans.items[5].name).toBe('Plan 1');
					expect(plans.items[5].group).toBe('Project 3');
					expect(plans.items[5].isDisabled).toBe(false);
				});

			});

		});
	});