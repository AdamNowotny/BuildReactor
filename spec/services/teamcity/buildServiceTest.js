define([
	'services/teamcity/buildService',
	'services/teamcity/teamcityRequest',
	'signals',
	'json!fixtures/teamcity/buildTypes.json'
], function (TeamCity, request, Signal, buildTypesJson) {

	'use strict';

	describe('services/teamcity/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'TeamCity 7',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				url: 'http://example.com/',
				name: 'TeamCity instance'
			};
			ccBuildInfo = {
				serviceName: 'service name',
				buildName: 'build name',
				group: 'group name',
				url: 'http://example.com/link',
				icon: 'ci/icon.png'
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

		function createResult(response) {
			var returned = new Signal();
			returned.memorize = true;
			returned.dispatch({ response: response});
			return returned;
		}

		describe('projects', function () {

			it('should get build types', function () {
				var service = new TeamCity(settings);
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult({});
				});

				service.projects([ 'A', 'B' ]);

				expect(request.buildTypes).toHaveBeenCalled();
			});

			it('should return all build types', function () {
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult(buildTypesJson);
				});
				var service = new TeamCity(settings);
				var projects;

				service.projects([ 'A', 'B' ]).addOnce(function (result) {
					projects = result.projects;
				});

				expect(projects.items.length).toBe(207);
			});

			it('should convert to build', function () {
				spyOn(request, 'buildTypes').andCallFake(function () {
					return createResult(buildTypesJson);
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

		describe('updateAll', function () {

			it('should update all selected builds', function () {

			});

		});

		describe('activeProjects', function () {


		});

	});

});