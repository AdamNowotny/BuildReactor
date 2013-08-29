define([
	'services/cctray/buildService',
	'services/request',
	'rx',
	'jquery',
	'mout/object/mixIn'
],
function (BuildService, request, Rx, $, mixIn) {

	'use strict';

	describe('services/cctray/buildService', function () {

		var service;
		var	settings;
		var events;
		var states;

		beforeEach(function () {
			settings = {
				name: 'Build Server',
				username: null,
				password: null,
				url: 'http://example.com/',
				updateInterval: 10000,
				icon: 'cctray/icon.png',
				projects: ['CruiseControl.NET', 'Build-Server-Config']
			};
			states = [createState1(), createState2()];
			spyOn(request, 'xml').andCallFake(function (options) {
				return Rx.Observable.returnValue(states);
			});
			service = new BuildService(settings);
			events = [];
		});

		function createState1() {
			return {
				id: 'CruiseControl.NET',
				name: 'CruiseControl.NET',
				group: 'CruiseControl.NET',
				webUrl: 'http://build.nauck-it.de/server/build.nauck-it.de/project/CruiseControl.NET/ViewProjectReport.aspx',
				isBroken: false,
				isRunning: false,
				tags: [],
				changes: []
			};
		}

		function createState2() {
			return {
				id: 'Build-Server-Config',
				name: 'Build-Server-Config',
				group: 'Build Server Configuration',
				webUrl: 'http://build.nauck-it.de/server/build.nauck-it.de/project/Build-Server-Config/ViewProjectReport.aspx',
				isBroken: false,
				isRunning: false,
				changes: []
			};
		}

		function extendState(state) {
			return mixIn(state, {
				isDisabled: false,
				serviceName: 'Build Server',
				serviceIcon: 'cctray/icon.png',
				tags: []
			});
		}

		function rememberEvent(event) {
			events.push(event);
		}

		function eventPushed(eventName) {
			return getEvents(eventName).length > 0;
		}

		function getLastEvent(eventName) {
			var eventsByName = getEvents(eventName);
			return eventsByName.length ?
				eventsByName[eventsByName.length - 1] :
				null;
		}

		function getEvents(eventName) {
			return events.filter(function (event) {
				return event.eventName === eventName;
			});
		}

		it('should provide default settings', function () {
			var settings = BuildService.settings();

			expect(settings.typeName).toBe('CCTray Generic');
			expect(settings.baseUrl).toBe('cctray');
			expect(settings.icon).toBe('cctray/icon.png');
			expect(settings.projects.length).toBe(0);
			expect(settings.url).toBeDefined();
			expect(settings.urlHint).toBe('URL, e.g. http://cruisecontrol.instance.com/cctray.xml');
			expect(settings.username).toBeDefined();
			expect(settings.password).toBeDefined();
			expect(settings.updateInterval).toBe(60);
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

		describe('updateAll', function () {

			var eventsSubscription;

			beforeEach(function () {
				service = new BuildService(settings);
				events = [];
				eventsSubscription = service.events.subscribe(rememberEvent);
			});

			afterEach(function () {
				eventsSubscription.dispose();
			});

			it('should set default last build status', function () {
				var getDefaultState = function (id) {
					return {
						id: id,
						name: id,
						group: null,
						webUrl: null,
						isBroken: false,
						isRunning: false,
						isDisabled: false,
						serviceName: settings.name,
						serviceIcon: settings.icon,
						tags: []
					};
				}; 

				expect(service.latestBuildStates['CruiseControl.NET']).toEqual(getDefaultState('CruiseControl.NET'));
			});

			it('should set request options', function () {
				request.xml.andCallFake(function (options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
					expect(options.url).toBe('http://example.com/cc.xml');
					return Rx.Observable.returnValue(states);
				});

				service.cctrayLocation = 'cc.xml';
				service.updateAll();

				expect(request.xml).toHaveBeenCalled();
			});

			describe('response parsing', function () {

				var projectsXml;
				var parsedResponse;

				beforeEach(function () {
					projectsXml = $(readFixtures('src/services/cctray/cruisecontrolnet.fixture.xml'));
					request.xml.andCallFake(function (options) {
						parsedResponse = options.parser(projectsXml);
						return Rx.Observable.returnValue(parsedResponse);
					});
				});

				it('should parse xml into project array', function () {
					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse.length).toBe(9);
					expect(parsedResponse[0]).toEqual(createState1());
				});

				it('should parse xml if build broken with failure', function () {
					projectsXml.find('Project').attr('lastBuildStatus', 'Failure');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isBroken).toBe(true);
				});

				it('should parse changes', function () {
					projectsXml = $(readFixtures('src/services/cctray/go.fixture.xml'));

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[3].changes).toEqual([{ name: 'DOMAIN\\Adam.Nowotny' }]);
				});

				it('should parse changes if breakers message empty', function () {
					projectsXml = $(readFixtures('src/services/cctray/breakers_empty.fixture.xml'));

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[10].changes).toEqual([]);
				});

				it('should parse xml if build broken with failure', function () {
					projectsXml.find('Project').attr('lastBuildStatus', 'Failure');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isBroken).toBe(true);
				});

				it('should parse xml if build running', function () {
					projectsXml.find('Project').attr('activity', 'Building');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isRunning).toBe(true);
				});

				it('should ignore if status unknown and broken previously', function () {
					service.latestBuildStates['CruiseControl.NET'].isBroken = true;
					projectsXml.find('Project').attr('lastBuildStatus', 'Unknown');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isBroken).not.toBeDefined();
				});

			});

			it('should remember new build state', function () {
				service.updateAll().subscribe();

				var states = service.latestBuildStates;
				expect(states['CruiseControl.NET']).toEqual(extendState(createState1()));
				expect(states['Build-Server-Config']).toEqual(extendState(createState2()));
			});

			it('should push update when no builds selected', function () {
				settings.projects = [];

				var completed = false;
				service.updateAll().subscribe(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should not fail if build update failed', function () {
				var stateError = "Error";

				request.xml.andCallFake(function (options) {
					return Rx.Observable.throwException(stateError);
				});

				var sequenceFailed = false;
				var response;
				service.updateAll().subscribe(function (state) {
					response = state;
				}, function () {
					sequenceFailed = true;
				});

				expect(sequenceFailed).toBe(false);
				expect(response.error).toEqual(stateError);
			});

		});

		describe('build events', function () {

			var oldState;
			var newState;
			var eventsSubscription;

			beforeEach(function () {
				service = new BuildService(settings);
				events = [];
				eventsSubscription = service.events.subscribe(rememberEvent);
				oldState = service.latestBuildStates['CruiseControl.NET'];
				newState = mixIn({
					id: 'CruiseControl.NET',
					isBroken: false,
					isRunning: false,
					isDisabled: false,
					changes: []
				}, oldState);
				request.xml.andCallFake(function (options) {
					return Rx.Observable.returnValue([newState]);
				});
			});

			afterEach(function () {
				eventsSubscription.dispose();
			});

			it('should push buildOffline if build update failed', function () {
				var stateError = "Error";
				request.xml.andCallFake(function (options) {
					return Rx.Observable.throwException(stateError);
				});

				service.updateAll().subscribe();

				expect(eventPushed('buildOffline')).toBe(true);
				expect(getLastEvent('buildOffline').details.error).toEqual(stateError);
			});

			it('should push buildBroken if build broken', function () {
				oldState.isBroken = false;
				newState.isBroken = true;

				service.updateAll().subscribe();

				expect(eventPushed('buildBroken')).toBe(true);
				expect(getLastEvent('buildBroken').details).toEqual(newState);
			});

			it('should not push buildBroken if build already broken', function () {
				oldState.isBroken = true;
				newState.isBroken = true;

				service.updateAll().subscribe();

				expect(eventPushed('buildBroken')).toBe(false);
			});

			it('should push buildFixed if build was fixed', function () {
				oldState.isBroken = true;
				newState.isBroken = false;


				service.updateAll().subscribe();

				expect(eventPushed('buildFixed')).toBe(true);
				expect(getLastEvent('buildFixed').details).toEqual(newState);
			});

			it('should not push buildFixed if build was not broken', function () {
				oldState.isBroken = false;
				newState.isBroken = false;

				service.updateAll().subscribe();

				expect(eventPushed('buildFixed')).toBe(false);
			});

			it('should push buildStarted if build started', function () {
				oldState.isRunning = false;
				newState.isRunning = true;

				service.updateAll().subscribe();

				expect(eventPushed('buildStarted')).toBe(true);
				expect(getLastEvent('buildStarted').details).toEqual(newState);
			});

			it('should not push buildStarted if build already running', function () {
				oldState.isRunning = true;
				newState.isRunning = true;

				service.updateAll().subscribe();

				expect(eventPushed('buildStarted')).toBe(false);
			});

			it('should push buildFinished if build finished', function () {
				oldState.isRunning = true;
				newState.isRunning = false;

				service.updateAll().subscribe();

				expect(eventPushed('buildFinished')).toBe(true);
				expect(getLastEvent('buildFinished').details).toEqual(newState);
			});

			it('should not push buildFinished if build was not running', function () {
				oldState.isRunning = false;
				newState.isRunning = false;

				service.updateAll().subscribe();

				expect(eventPushed('buildFinished')).toBe(false);
			});

		});

		describe('availableBuilds', function () {

			var projectsXml = $(readFixtures('src/services/cctray/cruisecontrolnet.fixture.xml'));

			it('should return available builds', function () {
				var builds = Rx.Observable.returnValue(projectsXml);
				request.xml.andReturn(builds);

				expect(service.availableBuilds()).toBe(builds);
			});

			it('should use credentials', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				request.xml.andCallFake(function (options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
				});

				service.availableBuilds();

				expect(request.xml).toHaveBeenCalled();
			});

			it('should get available builds from correct URL', function () {
				request.xml.andCallFake(function (options) {
					expect(options.url).toBe('http://example.com/cc.xml');
				});

				service.cctrayLocation = 'cc.xml';
				service.availableBuilds();

				expect(request.xml).toHaveBeenCalled();
			});

			it('should parse response', function () {
				request.xml.andCallFake(function (options) {
					var response = options.parser(projectsXml);
					expect(response.items.length).toBe(9);
					expect(response.items[0].id).toBe('CruiseControl.NET');
					expect(response.items[0].name).toBe('CruiseControl.NET');
					expect(response.items[0].group).toBe('CruiseControl.NET');
					expect(response.items[0].isDisabled).toBe(false);
				});

				service.availableBuilds();

				expect(request.xml).toHaveBeenCalled();
			});

		});

	});
});