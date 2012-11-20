define([
	'services/buildService',
	'services/build',
	'jasmineSignals'
], function (BuildService, Build, spyOnSignal) {
	'use strict';

	describe('services/buildService', function () {

		var settings;
		var service;

		beforeEach(function () {
			settings = {
				typeName: 'TeamCity',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				url: 'http://example.com/',
				name: 'TeamCity instance'
			};
			service = new BuildService(settings);
		});

		describe('activeProjects', function () {

			beforeEach(function () {
				settings.projects = ['bt297'];
			});

			it('should return service name', function () {
				var result = service.activeProjects();

				expect(result.name).toBe('TeamCity instance');
			});

			it('should return empty if no projects monitored', function () {
				var result = service.activeProjects();

				expect(result.items.length).toBe(0);
			});

			it('should return item name', function () {
				service.builds['A'] = { name: 'Build name' };

				var result = service.activeProjects();

				expect(result.items[0].name).toBe('Build name');
			});

			it('should return group name', function () {
				service.builds['A'] = { projectName: 'Project name' };

				var result = service.activeProjects();

				expect(result.items[0].group).toBe('Project name');
			});

			it('should indicate if broken', function () {
				service.builds['A'] = { isRunning: true };

				var result = service.activeProjects();

				expect(result.items[0].isBuilding).toBe(true);
			});

			it('should indicate if build is in progress', function () {
				service.builds['A'] = { isBroken: true };

				var result = service.activeProjects();

				expect(result.items[0].isBroken).toBe(true);
			});

			it('should return webUrl', function () {
				service.builds['A'] = { webUrl: 'http://example.com/' };

				var result = service.activeProjects();

				expect(result.items[0].url).toBe('http://example.com/');
			});

		});

		describe('observeBuild', function () {

			it('should subscribe to errorThrown', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.errorThrown);

				service.observeBuild(build);
				build.on.errorThrown.dispatch(build);

				expect(service.on.errorThrown).toHaveBeenDispatched();
			});

			it('should subscribe to broken', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.brokenBuild);

				service.observeBuild(build);
				build.on.broken.dispatch(build);

				expect(service.on.brokenBuild).toHaveBeenDispatched();
			});

			it('should subscribe to fixed', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.fixedBuild);

				service.observeBuild(build);
				build.on.fixed.dispatch(build);

				expect(service.on.fixedBuild).toHaveBeenDispatched();
			});

			it('should subscribe to started', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.startedBuild);

				service.observeBuild(build);
				build.on.started.dispatch(build);

				expect(service.on.startedBuild).toHaveBeenDispatched();
			});

			it('should subscribe to finished', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.finishedBuild);

				service.observeBuild(build);
				build.on.finished.dispatch(build);

				expect(service.on.finishedBuild).toHaveBeenDispatched();
			});
		});

	});

});