define([
	'core/services/jenkins/buildService',
	'core/services/jenkins/jenkinsBuild',
	'core/services/request',
	'rx',
	'text!core/services/jenkins/views.fixture.json'
], function (BuildService, JenkinsBuild, request, Rx, apiFixture) {

	'use strict';

	describe('core/services/jenkins/buildService', function () {

		var settings;
		var service;

		beforeEach(function () {
			settings = {
				typeName: 'Jenkins',
				baseUrl: 'jenkins',
				icon: 'jenkins/icon.png',
				url: 'http://example.com/',
				name: 'Jenkins instance',
				projects: ['BuildReactor']
			};
			service = new BuildService(settings);
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('Jenkins');
			expect(defaultSettings.baseUrl).toBe('jenkins');
			expect(defaultSettings.icon).toBe('jenkins/icon.png');
			expect(defaultSettings.logo).toBe('jenkins/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('URL, e.g. http://ci.jenkins-ci.org/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
		});

		it('should set Build factory method', function () {
			expect(service.Build).toBe(JenkinsBuild);
		});

		it('should expose interface', function () {
			expect(service.settings).toBe(settings);
			expect(service.updateAll).toBeDefined();
			expect(service.start).toBeDefined();
			expect(service.stop).toBeDefined();
			expect(service.activeProjects).toBeDefined();
			expect(service.availableBuilds).toBeDefined();
			expect(service.events).toBeDefined();
		});

		describe('availableBuilds', function () {

			var apiJson;
			var service;

			beforeEach(function () {
				apiJson = JSON.parse(apiFixture);
				service = new BuildService(settings);
			});

			it('should return available builds', function () {
				var builds = Rx.Observable.returnValue(apiJson);
				spyOn(request, 'json').andReturn(builds);

				expect(service.availableBuilds()).toBe(builds);
			});

			it('should use credentials', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				spyOn(request, 'json').andCallFake(function (options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should get available builds from correct URL', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					expect(options.url).toBe('http://example.com/api/json?depth=1');
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});
			
			it('should increase timeout', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					expect(options.timeout).toBe(200000);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should return projects', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					var response = options.parser(apiJson);
					expect(response.items).toBeDefined();
					expect(response.items.length).toBe(63);
					expect(response.items[0].id).toBe('config-provider-model');
					expect(response.items[0].name).toBe('config-provider-model');
					expect(response.items[0].group).toBe(null);
					expect(response.items[0].isDisabled).toBe(false);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should return views', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					var response = options.parser(apiJson);
					expect(response.views).toBeDefined();
					expect(response.views[0].name).toBeDefined();
					expect(response.views[0].items).toBeDefined();
					expect(response.views[0].items[0]).toBeDefined();
					expect(response.primaryView).toBeDefined();
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

		});
	});

});