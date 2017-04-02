define([
	'core/services/cctray/buildService',
	'core/services/request',
	'rx',
	'jquery',
	'mout/object/mixIn',
	'raw!core/services/cctray/cruisecontrolnet.fixture.xml',
	'raw!core/services/cctray/go.fixture.xml',
	'raw!core/services/cctray/breakers_empty.fixture.xml',
	'raw!core/services/cctray/go_multiple_breakers.fixture.xml',
	'raw!core/services/cctray/ccnet_no_categories.fixture.xml'
],
function(BuildService, request, Rx, $, mixIn, ccnetFixture, goFixture, noBreakersFixture, manyBreakersFixture, noCategoriesFixture) {

	'use strict';

	describe('core/services/cctray/buildService', function() {

		var service;
		var	settings;
		var events;
		var states;

		beforeEach(function() {
			settings = {
				name: 'Build Server',
				username: null,
				password: null,
				url: 'http://example.com/',
				updateInterval: 10000,
				projects: ['CruiseControl.NET', 'Build-Server-Config']
			};
			states = [createState1(), createState2()];
			spyOn(request, 'xml').and.callFake(function(options) {
				return Rx.Observable.return(states);
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
				isWaiting: false,
				serviceName: settings.name,
				serviceIcon: 'src/core/services/cctray/icon.png',
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
				serviceName: settings.name,
				serviceIcon: 'src/core/services/cctray/icon.png',
				changes: []
			};
		}

		function extendState(state) {
			return mixIn(state, {
				isDisabled: false,
				serviceName: 'Build Server',
				serviceIcon: 'src/core/services/cctray/icon.png',
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
			return events.filter(function(event) {
				return event.eventName === eventName;
			});
		}

		it('should expose interface', function() {
			expect(service.settings).toBe(settings);
			expect(service.updateAll).toBeDefined();
			expect(service.start).toBeDefined();
			expect(service.stop).toBeDefined();
			expect(service.availableBuilds).toBeDefined();
			expect(service.events).toBeDefined();
		});

		describe('updateAll', function() {

			var eventsSubscription;

			beforeEach(function() {
				service = new BuildService(settings);
				events = [];
				eventsSubscription = service.events.subscribe(rememberEvent);
			});

			afterEach(function() {
				eventsSubscription.dispose();
			});

			it('should set request options', function() {
				request.xml.and.callFake(function(options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
					expect(options.url).toBe('http://example.com/cc.xml');
					return Rx.Observable.return(states);
				});

				service.cctrayLocation = 'cc.xml';
				service.updateAll();

				expect(request.xml).toHaveBeenCalled();
			});

			describe('response parsing', function() {

				var projectsXml;
				var parsedResponse;

				beforeEach(function() {
					projectsXml = $(ccnetFixture);
					request.xml.and.callFake(function(options) {
						parsedResponse = options.parser(projectsXml);
						return Rx.Observable.return(parsedResponse);
					});
				});

				it('should parse xml into project array', function() {
					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse.length).toBe(9);
					expect(parsedResponse[0]).toEqual({
						id: 'CruiseControl.NET',
						name: 'CruiseControl.NET',
						group: 'CruiseControl.NET',
						webUrl: 'http://build.nauck-it.de/server/build.nauck-it.de/project/CruiseControl.NET/ViewProjectReport.aspx',
						isBroken: false,
						isRunning: false,
						isWaiting: false,
						tags: [],
						changes: []
					});
				});

				it('should parse xml if build broken with failure', function() {
					projectsXml.find('Project').attr('lastBuildStatus', 'Failure');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isBroken).toBe(true);
				});

				it('should parse changes', function() {
					projectsXml = $(goFixture);

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[3].changes).toEqual([{ name: 'DOMAIN\\Adam.Nowotny' }]);
				});

				it('should parse changes if breakers message empty', function() {
					projectsXml = $(noBreakersFixture);

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[10].changes).toEqual([]);
				});

				it('should parse changes when more breakers listed', function() {
					projectsXml = $(manyBreakersFixture);

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[2].changes).toEqual([
						{ name: 'user1' },
						{ name: 'user2' },
						{ name: 'user3' }
					]);
				});

				it('should parse xml if build broken with failure', function() {
					projectsXml.find('Project').attr('lastBuildStatus', 'Failure');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isBroken).toBe(true);
				});

				it('should parse xml if build running', function() {
					projectsXml.find('Project').attr('activity', 'Building');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isRunning).toBe(true);
				});

				it('should parse xml if build pending', function() {
					projectsXml.find('Project').attr('lastBuildStatus', 'Pending');

					service.updateAll();

					expect(request.xml).toHaveBeenCalled();
					expect(parsedResponse[0].isWaiting).toBe(true);
				});

			});

			it('should push update when no builds selected', function() {
				settings.projects = [];

				var completed = false;
				service.updateAll().subscribe(function() {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should not fail if build update failed', function() {
				var stateError = "Error";

				request.xml.and.callFake(function(options) {
					return Rx.Observable.throw(stateError);
				});

				var sequenceFailed = false;
				var response;
				service.updateAll().subscribe(function(state) {
					response = state;
				}, function() {
					sequenceFailed = true;
				});

				expect(sequenceFailed).toBe(false);
				expect(response.error).toEqual(stateError);
			});

		});

		describe('availableBuilds', function() {

			var projectsXml = $(ccnetFixture);

			it('should return available builds', function() {
				var builds = Rx.Observable.return(projectsXml);
				request.xml.and.returnValue(builds);

				expect(service.availableBuilds()).toBe(builds);
			});

			it('should use credentials', function() {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				request.xml.and.callFake(function(options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
				});

				service.availableBuilds();

				expect(request.xml).toHaveBeenCalled();
			});

			it('should get available builds from correct URL', function() {
				request.xml.and.callFake(function(options) {
					expect(options.url).toBe('http://example.com/cc.xml');
				});

				service.cctrayLocation = 'cc.xml';
				service.availableBuilds();

				expect(request.xml).toHaveBeenCalled();
			});

			it('should parse response with CC.NET categories', function() {
				request.xml.and.callFake(function(options) {
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

			it('should parse response without categories', function() {
				request.xml.and.callFake(function(options) {
					var response = options.parser(noCategoriesFixture);
					expect(response.items.length).toBe(2);
					expect(response.items[0].id).toBe('CruiseControl.NET');
					expect(response.items[0].name).toBe('CruiseControl.NET');
					expect(response.items[0].group).toBe(null);
					expect(response.items[0].isDisabled).toBe(false);
				});

				service.availableBuilds();

				expect(request.xml).toHaveBeenCalled();
			});

			it('should parse groups for names with ::', function() {
				request.xml.and.callFake(function(options) {
					var response = options.parser(goFixture);
					expect(response.items[0].id).toBe('Project :: Build');
					expect(response.items[0].name).toBe('Build');
					expect(response.items[0].group).toBe('Project');
				});

				service.availableBuilds();

				expect(request.xml).toHaveBeenCalled();
			});

		});

	});
});
