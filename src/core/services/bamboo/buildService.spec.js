define([
		'core/services/bamboo/buildService',
		'core/services/bamboo/bambooPlan',
		'rx',
		'core/services/request',
		'text!core/services/bamboo/projects.fixture.json',
		'text!core/services/bamboo/projects_page2.fixture.json',
		'text!core/services/bamboo/projects_plans_page2.fixture.json',
		'jquery',
		'rx.aggregates'
	],
	function (BuildService, BambooPlan, Rx, request, projectsFixture, projects2Fixture, projects3Fixture, $) {

		'use strict';

		describe('core/services/bamboo/BuildService', function () {

			var service;
			var settings;

			beforeEach(function () {
				settings = {
					name: 'My Bamboo CI',
					username: 'username',
					password: 'password',
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
				expect(settings.urlHint).toBe('URL, e.g. https://[your_account].atlassian.net/builds');
				expect(settings.url).toBeDefined();
				expect(settings.username).toBeDefined();
				expect(settings.password).toBeDefined();
				expect(settings.updateInterval).toBe(60);
			});

			describe('availableBuilds', function () {

				var projectsJson, projectsJson2, projectsJson3;

				beforeEach(function () {
					projectsJson = JSON.parse(projectsFixture);
					projectsJson2 = JSON.parse(projects2Fixture);
					projectsJson3 = JSON.parse(projects3Fixture);
					spyOn(request, 'json').andCallFake(function (options) {
						switch (options.url + '?' + $.param(options.data)) {
						case 'http://example.com/rest/api/latest/project?expand=projects.project.plans.plan&start-index=0&os_authType=basic':
						case 'http://example.com/rest/api/latest/project?expand=projects.project.plans.plan&start-index=0':
							return Rx.Observable.returnValue(projectsJson);
						case 'http://example.com/rest/api/latest/project?expand=projects.project.plans.plan&start-index=1&os_authType=basic':
						case 'http://example.com/rest/api/latest/project?expand=projects.project.plans.plan&start-index=1':
							return Rx.Observable.returnValue(projectsJson2);
						case 'http://example.com/rest/api/latest/project/PROJECT1?expand=plans.plan&start-index=3&os_authType=basic':
						case 'http://example.com/rest/api/latest/project/PROJECT1?expand=plans.plan&start-index=3':
							return Rx.Observable.returnValue(projectsJson3);
						default:
							throw new Error('Unknown URL: ' + options.url);
						}
					});
				});

				it('should pass options to request', function () {
					request.json.andCallFake(function (options) {
						expect(options.username).toBe(settings.username);
						expect(options.password).toBe(settings.password);
						expect(options.url).toBe('http://example.com/rest/api/latest/project');
						expect(options.data).toEqual({expand: 'projects.project.plans.plan', 'start-index': 0, os_authType: 'basic'});
						return Rx.Observable.never();
					});

					service.availableBuilds();

					expect(request.json).toHaveBeenCalled();
				});

				it('should set authType to guest when no credentials specified', function () {
					settings.username = null;
					settings.password = null;
					request.json.andCallFake(function (options) {
						expect(options.data).toEqual({
							expand: 'projects.project.plans.plan',
							'start-index': 0,
							'os_authType': 'guest'
						});
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

				it('should parse plans when multiple requests for projects required', function () {
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

				it('should parse plans when multiple requests for plans within a project required', function () {
					projectsJson.projects.project[0].plans.size = 4;
					projectsJson.projects.project[0].plans['max-result'] = 3;

					var plans;
					service.availableBuilds().subscribe(function (d) {
						plans = d;
					});

					expect(plans.items.length).toBe(6);
					expect(plans.items[0].id).toBe('PROJECT1-BRANCH18X');
					expect(plans.items[0].name).toBe('Deploy Nightly 1.8.x');
					expect(plans.items[0].group).toBe('Nightly Builds');
					expect(plans.items[0].isDisabled).toBe(false);
				});

			});

		});
	});
