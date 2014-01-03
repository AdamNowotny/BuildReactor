define([
	'core/services/buildbot/buildService',
	'core/services/buildbot/buildbotBuild',
	'core/services/request',
	'rx'
], function (BuildService, BuildbotBuild, request, Rx) {

	'use strict';

	describe('core/services/buildbot/buildService', function () {

		var settings;
		var service;

		beforeEach(function () {
			settings = {
				typeName: 'BuildBot',
				baseUrl: 'buildbot',
				icon: 'buildbot/icon.png',
				url: 'http://example.com/',
				name: 'Buildbot instance',
				projects: ['BuildReactor']
			};
			service = new BuildService(settings);
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('BuildBot');
			expect(defaultSettings.baseUrl).toBe('buildbot');
			expect(defaultSettings.icon).toBe('buildbot/icon.png');
			expect(defaultSettings.logo).toBe('buildbot/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('URL, e.g. http://buildbot.buildbot.net/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
		});

		it('should set Build factory method', function () {
			expect(service.Build).toBe(BuildbotBuild);
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
				apiJson = JSON.parse(readFixtures('src/core/services/buildbot/builders_all.fixture.json'));
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
					expect(options.url).toBe('http://example.com/json/builders');
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should return projects', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					var response = options.parser(apiJson);
					expect(response.items).toBeDefined();
					expect(response.items.length).toBe(35);
					expect(response.items[0].id).toBe('coverage');
					expect(response.items[0].name).toBe('coverage');
					expect(response.items[0].group).toBe('docs');
					expect(response.items[0].isDisabled).toBe(false);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

		});
	});

});