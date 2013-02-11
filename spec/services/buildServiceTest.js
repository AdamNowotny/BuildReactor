define([
	'services/buildService',
	'services/build',
	'signals',
	'jasmineSignals'
], function (BuildService, Build, Signal, spyOnSignal) {
	'use strict';

	describe('services/buildService', function () {

		var settings;
		var service;
		var updateSuccessSignal;

		beforeEach(function () {
			settings = {
				typeName: 'TeamCity',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				url: 'http://example.com/',
				name: 'TeamCity instance',
				projects: [ 'Build1', 'Build2']
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

			it('should ignore disabled builds', function () {
				service.builds['A'] = { name: 'Build name', isDisabled: true };

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

		describe('updateAll', function () {

			var mockBuildUpdate;

			beforeEach(function () {
				Build.prototype.update = {};
				mockBuildUpdate = spyOn(Build.prototype, 'update').andCallFake(function () {
					switch (this.id) {
					case 'Build1':
						this.projectName = 'Project 1';
						this.name = 'Build 1';
						break;
					case 'Build2':
						this.projectName = 'Project 2';
						this.name = 'Build 2';
						break;
					}
					var finishedUpdate = new Signal();
					finishedUpdate.memorize = true;
					finishedUpdate.dispatch();
					return finishedUpdate;
				});
				updateSuccessSignal = new Signal();
				updateSuccessSignal.memorize = true;
				updateSuccessSignal.dispatch({ result: {} });
			});

			afterEach(function () {
				Build.prototype = {};
			});

			it('should update builds', function () {
				service.updateAll();

				expect(mockBuildUpdate).toHaveBeenCalled();
				expect(mockBuildUpdate.callCount).toBe(settings.projects.length);
			});

			it('should create builds', function () {
				service.updateAll();

				expect(service.builds['Build1'].id).toBe('Build1');
				expect(service.builds['Build1'].name).toBe('Build 1');
				expect(service.builds['Build1'].projectName).toBe('Project 1');
				expect(service.builds['Build1'].settings).toBe(settings);
			});

			it('should create builds only once', function () {
				settings.projects = ['bt297'];
				service.updateAll();
				var build = service.builds['bt297'];

				service.updateAll();

				expect(service.builds['bt297']).toBe(build);
			});

			it('should signal when all build updates finished', function () {
				mockBuildUpdate.andReturn(updateSuccessSignal);
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});
			
			it('should not update if no selected builds', function () {
				settings.projects = undefined;

				service.updateAll();

				expect(Build.prototype.update).not.toHaveBeenCalled();
			});

			it('should signal when no builds selected', function () {
				settings.projects = [];
				mockBuildUpdate.andReturn(updateSuccessSignal);
				service = new BuildService(settings);
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should signal updated when all plan updates finished with error', function () {
				var updateErrorSignal = new Signal();
				updateErrorSignal.memorize = true;
				updateErrorSignal.dispatch(false, { message: 'error message' });
				mockBuildUpdate.andReturn(updateErrorSignal);
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should not signal when some plans still not finished', function () {
				var plansUpdated = 0;
				mockBuildUpdate.andCallFake(function () {
					plansUpdated++;
					expect(completed).toBe(false);
					return updateSuccessSignal;
				});
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should observe build', function () {
				settings.projects = ['A'];
				spyOn(service, 'observeBuild');

				service.updateAll();

				expect(service.observeBuild).toHaveBeenCalledWith(service.builds['A']);
			});

			it('should only observe once', function () {
				settings.projects = ['A'];
				spyOn(service, 'observeBuild');

				service.updateAll();
				service.updateAll();

				expect(service.observeBuild.callCount).toBe(1);
			});

		});

		describe('observeBuild', function () {

			it('should subscribe to errorThrown', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.errorThrown);

				service.observeBuild(build);
				build.on.errorThrown.dispatch(build);

				expect(service.on.errorThrown).toHaveBeenDispatchedWith(build);
			});

			it('should subscribe to broken', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.brokenBuild);

				service.observeBuild(build);
				build.on.broken.dispatch(build);

				expect(service.on.brokenBuild).toHaveBeenDispatched();
				expect(service.on.brokenBuild).not.toHaveBeenDispatchedWith(build);
			});

			it('should subscribe to fixed', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.fixedBuild);

				service.observeBuild(build);
				build.on.fixed.dispatch(build);

				expect(service.on.fixedBuild).toHaveBeenDispatched();
				expect(service.on.fixedBuild).not.toHaveBeenDispatchedWith(build);
			});

			it('should subscribe to started', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.startedBuild);

				service.observeBuild(build);
				build.on.started.dispatch(build);

				expect(service.on.startedBuild).toHaveBeenDispatched();
				expect(service.on.startedBuild).not.toHaveBeenDispatchedWith(build);
			});

			it('should subscribe to finished', function () {
				var build = new Build(settings);
				spyOnSignal(service.on.finishedBuild);

				service.observeBuild(build);
				build.on.finished.dispatch(build);

				expect(service.on.finishedBuild).toHaveBeenDispatched();
				expect(service.on.finishedBuild).not.toHaveBeenDispatchedWith(build);
			});
		});

	});

});