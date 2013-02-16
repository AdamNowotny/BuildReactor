define([
	'services/teamcity/buildService',
	'services/teamcity/teamcityRequest',
	'services/teamcity/teamcityBuild',
	'signals',
	'json!fixtures/teamcity/buildTypes.json',
	'json!fixtures/teamcity/build.json'
], function (TeamCity, request, Build, Signal, buildTypesJson, buildJson) {

	'use strict';

	describe('services/teamcity/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'TeamCity',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				url: 'http://example.com/',
				name: 'TeamCity instance',
				projects: []
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = TeamCity.settings();

			expect(defaultSettings.typeName).toBe('TeamCity');
			expect(defaultSettings.baseUrl).toBe('teamcity');
			expect(defaultSettings.icon).toBe('teamcity/icon.png');
			expect(defaultSettings.logo).toBe('teamcity/logo.png');
			expect(defaultSettings.urlHint).toBe('http://teamcity.jetbrains.com/');
		});

		function createResult(result) {
			var returned = new Signal();
			returned.memorize = true;
			if (result) {
				returned.dispatch(result);
			}
			return returned;
		}

		describe('projects', function () {

			it('should get build types', function () {
				var service = new TeamCity(settings);
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult({ response: {} });
				});

				service.projects([ 'A', 'B' ]);

				expect(request.buildTypes).toHaveBeenCalled();
			});

			it('should return all build types', function () {
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult({ response: buildTypesJson });
				});
				var service = new TeamCity(settings);
				var projects;

				service.projects([ 'A', 'B' ]).addOnce(function (result) {
					projects = result.projects;
				});

				expect(projects.items.length).toBe(207);
			});

			it('should return errorInfo on failure', function () {
				var errorInfo = {};
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult({ error: errorInfo });
				});
				var service = new TeamCity(settings);
				var result;

				service.projects([ 'A', 'B' ]).addOnce(function (callbackResult) {
					result = callbackResult;
				});

				expect(result.error).toBe(errorInfo);
			});

			it('should signal error if parsing the response fails', function () {
				var service = new TeamCity(settings);
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult({ response: { buildType: 'unknown response' } });
				});

				var response;
				service.projects([]).addOnce(function (result) {
					response = result;
				});

				expect(response.error).toBeDefined();
				expect(response.error.name).toBe('ParseError');
			});

			it('should convert to build', function () {
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult({ response: buildTypesJson });
				});
				var service = new TeamCity(settings);
				var projects;

				service.projects([ 'bt297', 'B' ]).addOnce(function (result) {
					projects = result.projects.items;
					expect(projects[0].id).toBe('bt297');
					expect(projects[0].name).toBe('Build');
					expect(projects[0].group).toBe('Amazon API client');
					expect(projects[0].enabled).toBe(true);
					expect(projects[0].selected).toBe(true);
					expect(projects[0].webUrl).toBe('http://teamcity.jetbrains.com/viewType.html?buildTypeId=bt297');
				});

				expect(projects).toBeDefined();
			});

		});

	});

});