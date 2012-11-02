define([
	'services/cctray/buildService',
	'services/cctray/ccRequest',
	'services/cctray/project',
	'services/poolingService',
	'common/timer',
	'jquery',
	'signals',
	'jasmineSignals',
	'text!spec/fixtures/cctray/cruisecontrolnet.xml'
],
function (BuildService, ccRequest, project, PoolingService, Timer, $, signals, spyOnSignal, projectsXmlText) {

	'use strict';

	describe('services/cctray/buildService', function () {

		var service,
			settings,
			mockRequest,
			mockTimer,
			responseReceived,
			errorReceived,
			projectsXml = $.parseXML(projectsXmlText),
			initResponse = function () {
				mockRequest.andCallFake(function () {
					responseReceived.dispatch(projectsXml);
					return {
						responseReceived: responseReceived,
						errorReceived: errorReceived
					};
				});
			},
			initErrorResponse = function () {
				mockRequest.andCallFake(function () {
					errorReceived.dispatch({ message: 'ajax error' });
					return {
						responseReceived: responseReceived,
						errorReceived: errorReceived
					};
				});
			};

		beforeEach(function () {
			responseReceived = new signals.Signal();
			responseReceived.memorize = true;
			errorReceived = new signals.Signal();
			errorReceived.memorize = true;
			settings = {
				name: 'My Bamboo CI',
				username: null,
				password: null,
				url: 'http://example.com/',
				updateInterval: 10000,
				projects: ['CruiseControl.NET', 'NetReflector']
			};
			spyOn(PoolingService.prototype, 'start');
			spyOn(PoolingService.prototype, 'stop');
			service = new BuildService(settings);
			mockRequest = spyOn(ccRequest, 'projects');
			initResponse();
			mockTimer = spyOn(Timer.prototype, 'start');
		});

		it('should provide default settings', function () {
			var settings = BuildService.settings();

			expect(settings.typeName).toBe('CCTray Generic');
			expect(settings.baseUrl).toBe('cctray');
			expect(settings.icon).toBe('cctray/icon.png');
			expect(settings.projects.length).toBe(0);
			expect(settings.urlHint).toBe('http://cruisecontrol.instance.com/cctray.xml');
		});

		it('should create valid url', function () {
			settings.url = 'http://example.com';

			var GoBuildService = function (settings) {
				this.cctrayLocation = function () {
					return 'cc.xml';
				};
				BuildService.apply(this, [settings]);
			};
			GoBuildService.prototype = BuildService.prototype;

			var service = new GoBuildService(settings);

			expect(service.settings.url).toBe('http://example.com/cc.xml');
		});

		it('should expose service interface', function () {
			expect(service.name).toBe(settings.name);
			expect(service.on.brokenBuild).toBeDefined();
			expect(service.on.fixedBuild).toBeDefined();
			expect(service.on.startedBuild).toBeDefined();
			expect(service.on.finishedBuild).toBeDefined();
			expect(service.on.errorThrown).toBeDefined();
			expect(service.on.updating).toBeDefined();
			expect(service.on.updated).toBeDefined();
		});

		it('should signal updated when update finished', function () {
			spyOnSignal(service.on.updated);

			service.update();

			expect(service.on.updated).toHaveBeenDispatched(1);
		});

		it('should signal updated when finished with error', function () {
			spyOnSignal(service.on.updated);
			initErrorResponse();

			service.update();

			expect(service.on.updated).toHaveBeenDispatched(1);
		});

		it('should signal errorThrown when update failed', function () {
			spyOnSignal(service.on.errorThrown);
			initErrorResponse();

			service.update();

			expect(service.on.errorThrown).toHaveBeenDispatched();
		});

		it('multiple services should update independently', function () {
			var service1 = new BuildService({ name: 'Bamboo', url: 'http://example1.com/', projects: [] });
			var service2 = new BuildService({ name: 'Bamboo', url: 'http://example2.com/', projects: [] });
			spyOnSignal(service1.on.updating);
			spyOnSignal(service2.on.updating);

			service1.update();
			service2.update();
			service2.update();

			expect(service1.on.updating).toHaveBeenDispatched(1);
			expect(service2.on.updating).toHaveBeenDispatched(2);
		});

		describe('monitoring', function () {

			it('should update project', function () {
				service.update();
				var updateProject = service._selectedProjects['NetReflector'];
				spyOn(updateProject, 'update').andCallFake(function (info) {
					expect(info.name).toBeDefined();
					expect(info.category).toBeDefined();
					expect(info.status).toBeDefined();
					expect(info.url).toBeDefined();
					expect(info.activity).toBeDefined();
				});

				service.update();

				expect(updateProject.update).toHaveBeenCalled();
			});

			it('should signal brokenBuild if project signaled', function () {
				var failedProject;
				spyOnSignal(service.on.brokenBuild).matching(function (info) {
					return info.buildName === 'NetReflector' &&
						info.group === 'CruiseControl.NET';
				});
				initResponse();
				service.update();
				failedProject = service._selectedProjects['NetReflector'];

				failedProject.failed.dispatch(failedProject);

				expect(service.on.brokenBuild).toHaveBeenDispatched(1);
			});

			it('should signal fixedBuild if project signaled', function () {
				var fixedProject;
				spyOnSignal(service.on.fixedBuild).matching(function (info) {
					return info.buildName === 'NetReflector' &&
						info.group === 'CruiseControl.NET';
				});
				initResponse();
				service.update();
				fixedProject = service._selectedProjects['NetReflector'];

				fixedProject.fixed.dispatch(fixedProject);

				expect(service.on.fixedBuild).toHaveBeenDispatched(1);
			});

			it('should signal startedBuild if project signaled', function () {
				spyOnSignal(service.on.startedBuild);
				initResponse();
				service.update();
				var startedProject = service._selectedProjects['NetReflector'];

				startedProject.started.dispatch(startedProject);

				expect(service.on.startedBuild).toHaveBeenDispatched();
			});

			it('should signal finishedBuild if project signaled', function () {
				spyOnSignal(service.on.finishedBuild);
				initResponse();
				service.update();
				var finishedProject = service._selectedProjects['NetReflector'];

				finishedProject.finished.dispatch(finishedProject);

				expect(service.on.finishedBuild).toHaveBeenDispatched();
			});

			it('should ignore plans that are not monitored', function () {
				service.update();

				expect(service._selectedProjects['FastForward.NET']).not.toBeDefined();
			});

		});

		describe('projects', function () {


			it('should use url and credentials when getting plans', function () {
				mockRequest.andCallFake(function (requestSettings) {
					expect(requestSettings.username).toBe(settings.username);
					expect(requestSettings.password).toBe(settings.password);
					expect(requestSettings.url).toBe(settings.url);
					responseReceived.dispatch(projectsXml);
					return {
						responseReceived: responseReceived,
						errorReceived: errorReceived
					};
				});

				service.projects([]);

				expect(mockRequest).toHaveBeenCalled();
			});

			it('should return available projects', function () {
				var response;

				service.projects([]).addOnce(function (result) {
					response = result;
				});

				expect(response.error).not.toBeDefined();
				expect(response.projects).toBeDefined();
			});

			it('should return error', function () {
				initErrorResponse();
				var response;

				service.projects([]).addOnce(function (result) {
					response = result;
				});

				expect(response.error).toBeDefined();
				expect(response.projects).not.toBeDefined();
			});
		});
		
		describe('activeProjects', function () {

			it('should return service name', function () {
				var result = service.activeProjects();

				expect(result.name).toBe(settings.name);
			});

			it('should return empty if no projects monitored', function () {
				var result = service.activeProjects();

				expect(result.items.length).toBe(0);
			});

			it('should return item name', function () {
				service.update();

				var result = service.activeProjects();

				expect(result.items[0].name).toBe('CruiseControl.NET');
				expect(result.items[1].name).toBe('NetReflector');
			});

			it('should return group name', function () {
				service.update();

				var result = service.activeProjects();

				expect(result.items[0].group).toBe('CruiseControl.NET');
				expect(result.items[1].group).toBe('CruiseControl.NET');
			});

			it('should indicate if broken', function () {
				service.update();
				var buildingProject = project();
				buildingProject.update({
					status: 'Success',
					activity: 'Building'
				});
				service._selectedProjects['CruiseControl.NET'] = buildingProject;

				var result = service.activeProjects();

				expect(result.items[0].isBuilding).toBeTruthy();
			});

			it('should indicate if building', function () {
				service.update();
				var failedProject = project();
				failedProject.update({
					status: 'Failure'
				});
				service._selectedProjects['CruiseControl.NET'] = failedProject;

				var result = service.activeProjects();

				expect(result.items[0].isBroken).toBeTruthy();
			});

			it('should render link', function () {
				service.update();
				var failedProject = project();
				failedProject.update({
					status: 'Failure',
					url: 'http://example.com/project'
				});
				service._selectedProjects['CruiseControl.NET'] = failedProject;

				var result = service.activeProjects();

				expect(result.items[0].url).toBe('http://example.com/project');
			});

		});

	});
});