define([
	'services/teamcity/buildService',
	'services/teamcity/teamcityBuild',
	'services/request',
	'rx',
	'json!fixtures/teamcity/buildTypes.json'
], function (TeamCity, TeamcityBuild, request, Rx, buildTypesJson) {

	'use strict';

	describe('services/teamcity/buildService', function () {

		var settings;
		var service;

		beforeEach(function () {
			settings = {
				typeName: 'TeamCity',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				url: 'http://example.com/',
				name: 'TeamCity instance',
				projects: []
			};
			service = new TeamCity(settings);
		});

		it('should provide default settings', function () {
			var defaultSettings = TeamCity.settings();

			expect(defaultSettings.typeName).toBe('TeamCity');
			expect(defaultSettings.baseUrl).toBe('teamcity');
			expect(defaultSettings.icon).toBe('teamcity/icon.png');
			expect(defaultSettings.logo).toBe('teamcity/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('URL, e.g. http://teamcity.jetbrains.com/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
			expect(defaultSettings.branch).toBe('');
		});

		it('should set Build factory method', function () {
			expect(service.Build).toBe(TeamcityBuild);
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

			it('should modify url for guest user', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					expect(options.username).not.toBeDefined();
					expect(options.password).not.toBeDefined();
					expect(options.url).toBe('http://example.com/guestAuth/app/rest/buildTypes');
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should modify url if username and password specified', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				spyOn(request, 'json').andCallFake(function (options) {
					expect(options.username).toBe('USERNAME');
					expect(options.password).toBe('PASSWORD');
					expect(options.url).toBe('http://example.com/httpAuth/app/rest/buildTypes');
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should return available builds', function () {
				var builds = Rx.Observable.returnValue(buildTypesJson);
				spyOn(request, 'json').andReturn(builds);

				expect(service.availableBuilds()).toBe(builds);
			});

			it('should parse response', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					var response = options.parser(buildTypesJson);
					var projects = response.items;
					expect(projects[0].id).toBe('bt297');
					expect(projects[0].name).toBe('Build');
					expect(projects[0].group).toBe('Amazon API client');
					expect(projects[0].isDisabled).toBe(false);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

		});

	});

});