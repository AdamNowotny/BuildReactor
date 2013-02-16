define([
	'services/cctray/buildService',
	'services/cctray/ccRequest',
	'services/cctray/cctrayProject',
	'services/poolingService',
	'common/timer',
	'jquery',
	'signals',
	'jasmineSignals',
	'text!spec/fixtures/cctray/cruisecontrolnet.xml'
],
function (BuildService, ccRequest, CCTrayProject, PoolingService, Timer, $, Signal, spyOnSignal, projectsXmlText) {

	'use strict';

	describe('services/cctray/buildService', function () {

		var service,
			settings,
			mockRequest,
			mockTimer,
			responseReceived,
			errorReceived,
			projectsXml = $.parseXML(projectsXmlText),
			initResponse = function (response) {
				mockRequest.andCallFake(function () {
					responseReceived.dispatch(response);
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
			responseReceived = new Signal();
			responseReceived.memorize = true;
			errorReceived = new Signal();
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
			initResponse(projectsXml);
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

		it('should expose service interface', function () {
			expect(service.settings).toBe(settings);
			expect(service.on.brokenBuild).toBeDefined();
			expect(service.on.fixedBuild).toBeDefined();
			expect(service.on.startedBuild).toBeDefined();
			expect(service.on.finishedBuild).toBeDefined();
			expect(service.on.errorThrown).toBeDefined();
			expect(service.on.updating).toBeDefined();
			expect(service.on.updated).toBeDefined();
		});

		describe('updateAll', function () {

			it('should modify url', function () {
				mockRequest.andCallFake(function (settings) {
					expect(settings.url).toBe('http://example.com/cc.xml');
					responseReceived.dispatch(projectsXml);
					return {
						responseReceived: responseReceived,
						errorReceived: errorReceived
					};
				});

				service.cctrayLocation = 'cc.xml';
				service.updateAll();

				expect(mockRequest).toHaveBeenCalled();
			});

			it('should signal when update finished', function () {
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should signal if finished with error', function () {
				initErrorResponse();
				var completed = false;

				service.updateAll().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});
		});

		it('should signal errorThrown when update failed', function () {
			spyOnSignal(service.on.errorThrown);
			initErrorResponse();

			service.update();

			expect(service.on.errorThrown).toHaveBeenDispatched();
		});

		describe('monitoring', function () {

			it('should update project', function () {
				service.update();
				var updateProject = service.builds['NetReflector'];
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
				initResponse(projectsXml);
				service.update();
				failedProject = service.builds['NetReflector'];

				failedProject.on.broken.dispatch(failedProject);

				expect(service.on.brokenBuild).toHaveBeenDispatched(1);
			});

			it('should signal fixedBuild if project signaled', function () {
				var fixedProject;
				spyOnSignal(service.on.fixedBuild).matching(function (info) {
					return info.buildName === 'NetReflector' &&
						info.group === 'CruiseControl.NET';
				});
				initResponse(projectsXml);
				service.update();
				fixedProject = service.builds['NetReflector'];

				fixedProject.on.fixed.dispatch(fixedProject);

				expect(service.on.fixedBuild).toHaveBeenDispatched(1);
			});

			it('should signal startedBuild if project signaled', function () {
				spyOnSignal(service.on.startedBuild);
				initResponse(projectsXml);
				service.update();
				var startedProject = service.builds['NetReflector'];

				startedProject.on.started.dispatch(startedProject);

				expect(service.on.startedBuild).toHaveBeenDispatched();
			});

			it('should signal finishedBuild if project signaled', function () {
				spyOnSignal(service.on.finishedBuild);
				initResponse(projectsXml);
				service.update();
				var finishedProject = service.builds['NetReflector'];

				finishedProject.on.finished.dispatch(finishedProject);

				expect(service.on.finishedBuild).toHaveBeenDispatched();
			});

			it('should ignore plans that are not monitored', function () {
				service.update();

				expect(service.builds['FastForward.NET']).not.toBeDefined();
			});

		});

		describe('projects', function () {


			it('should use url and credentials when getting plans', function () {
				mockRequest.andCallFake(function (requestSettings) {
					expect(requestSettings.username).toBe(settings.username);
					expect(requestSettings.password).toBe(settings.password);
					expect(requestSettings.url).toBe('http://example.com/cc.xml');
					responseReceived.dispatch(projectsXml);
					return {
						responseReceived: responseReceived,
						errorReceived: errorReceived
					};
				});

				service.cctrayLocation = 'cc.xml';
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
				var buildingProject = new CCTrayProject('CruiseControl.NET');
				buildingProject.update({
					status: 'Success',
					activity: 'Building'
				});
				service.builds['CruiseControl.NET'] = buildingProject;

				var result = service.activeProjects();

				expect(result.items[0].isBuilding).toBeTruthy();
			});

			it('should indicate if building', function () {
				service.update();
				var failedProject = new CCTrayProject('CruiseControl.NET');
				failedProject.update({
					status: 'Failure'
				});
				service.builds['CruiseControl.NET'] = failedProject;

				var result = service.activeProjects();

				expect(result.items[0].isBroken).toBeTruthy();
			});

			it('should render link', function () {
				service.update();
				var failedProject = new CCTrayProject('CruiseControl.NET');
				failedProject.update({
					status: 'Failure',
					url: 'http://example.com/project'
				});
				service.builds['CruiseControl.NET'] = failedProject;

				var result = service.activeProjects();

				expect(result.items[0].url).toBe('http://example.com/project');
			});

		});

	});
});