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
		var mockBuildUpdate;

		beforeEach(function () {
			settings = {
				typeName: 'TeamCity',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				url: 'http://example.com/',
				name: 'TeamCity instance'
			};
			mockBuildUpdate = spyOn(Build.prototype, 'update').andCallFake(function () {
				return createResult({});
			});
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

		describe('updateAll', function () {

			it('should signal completed when no services configured', function () {
				var service = new TeamCity(settings);
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should signal completed when build update finished', function () {
				settings.projects = ['bt297', 'bt300'];
				var service = new TeamCity(settings);
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should create selected builds', function () {
				settings.projects = ['bt297', 'bt300'];
				var service = new TeamCity(settings);

				service.updateAll();

				expect(service.builds['bt297']).toBeDefined();
				expect(service.builds['bt300']).toBeDefined();
			});

			it('should update all selected builds', function () {
				settings.projects = ['A', 'B'];
				var service = new TeamCity(settings);

				service.updateAll();

				expect(Build.prototype.update.callCount).toBe(2);
			});

			it('should not update if no selected builds', function () {
				settings.projects = undefined;
				var service = new TeamCity(settings);

				service.updateAll();

				expect(Build.prototype.update).not.toHaveBeenCalled();
			});

			it('should create builds only once', function () {
				settings.projects = ['bt297'];
				var service = new TeamCity(settings);
				service.updateAll();
				var build = service.builds['bt297'];

				service.updateAll();

				expect(service.builds['bt297']).toBe(build);
			});

			it('should observe build', function () {
				settings.projects = ['A'];
				var service = new TeamCity(settings);
				spyOn(service, 'observeBuild');

				service.updateAll();

				expect(service.observeBuild).toHaveBeenCalledWith(service.builds['A']);
			});

			it('should only observe once', function () {
				settings.projects = ['A'];
				var service = new TeamCity(settings);
				spyOn(service, 'observeBuild');

				service.updateAll();
				service.updateAll();

				expect(service.observeBuild.callCount).toBe(1);
			});
		});

	});

});