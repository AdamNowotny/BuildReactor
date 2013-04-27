define([
	'services/buildServiceBase',
	'mout/object/mixIn',
	'rx'
], function (BuildServiceBase, mixIn, Rx) {
	'use strict';

	describe('services/buildServiceBase', function () {

		var settings;
		var service;
		var events = [];
		var eventsSubscription;
		var mockBuildUpdate;

		beforeEach(function () {
			settings = {
				typeName: 'custom',
				baseUrl: 'prefix',
				icon: 'base/icon.png',
				url: 'http://example.com/',
				name: 'Service name',
				projects: [ 'Build1', 'Build2']
			};
			mockBuildUpdate = spyOn(GenericBuild.prototype, 'update');
			service = new CustomBuildService(settings);
			events = [];
			eventsSubscription = service.events.subscribe(rememberEvent);
		});

		afterEach(function () {
			eventsSubscription.dispose();
		});

		function CustomBuildService() {
			mixIn(this, new BuildServiceBase(settings));
			this.Build = GenericBuild;
		}

		function GenericBuild(id, settings) {
			this.id = id;
			this.settings = settings;
		}
		GenericBuild.prototype.update = function () {};

		function createStateForId(id) {
			return {
				id: id,
				name: 'Build name ' + id,
				group: 'Group name',
				webUrl: 'http://example.com/build' + id,
				isBroken: false,
				isRunning: false,
				isDisabled: false,
				serviceName: 'Build Server',
				serviceIcon: 'base/icon.png'
			};
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

		describe('activeProjects', function () {

			var buildState1;
			var buildState2;

			beforeEach(function () {
				settings.projects = ['Build1', 'Build2'];
				service = new CustomBuildService(settings);
				buildState1 = createStateForId('Build1');
				buildState2 = createStateForId('Build2');
				service.latestBuildStates['Build1'] = buildState1;
				service.latestBuildStates['Build2'] = buildState2;
			});

			it('should return service name', function () {
				var result = service.activeProjects();

				expect(result.name).toBe(settings.name);
			});

			it('should return empty if no projects monitored', function () {
				settings.projects = [];

				var result = service.activeProjects();

				expect(result.items.length).toBe(0);
			});

			it('should ignore disabled builds', function () {
				buildState1.isDisabled = true;

				var result = service.activeProjects();

				expect(result.items.length).toBe(1);
			});

			it('should return build info', function () {
				var result = service.activeProjects();

				expect(result.items.length).toBe(2);
				expect(result.items[0]).toBe(buildState1);
				expect(result.items[1]).toBe(buildState2);
			});

		});

		describe('updateAll', function () {

			var update1Response;
			var update2Response;
			var eventsSubscription;

			beforeEach(function () {
				service = new CustomBuildService(settings);
				eventsSubscription = service.events.subscribe(rememberEvent);
				update1Response = Rx.Observable.returnValue(createStateForId('Build1'));
				update2Response = Rx.Observable.returnValue(createStateForId('Build2'));
				var callCount = 0;
				mockBuildUpdate.andCallFake(function () {
					callCount++;
					switch (callCount) {
					case 1:
						return update1Response;
					case 2:
						return update2Response;
					}
				});
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
						serviceIcon: settings.icon
					};
				}; 

				expect(service.latestBuildStates['Build1']).toEqual(getDefaultState('Build1'));
				expect(service.latestBuildStates['Build2']).toEqual(getDefaultState('Build2'));
			});

			it('should update builds', function () {
				var completed = false;
				service.updateAll().subscribe(function () {
					completed = true;
				});

				expect(completed).toBe(true);
				expect(mockBuildUpdate).toHaveBeenCalled();
				expect(mockBuildUpdate.callCount).toBe(settings.projects.length);
			});

			it('should remember new build state', function () {
				var state1 = createStateForId('Build1');
				var state2 = createStateForId('Build2');
				update1Response = Rx.Observable.returnValue(state1);
				update2Response = Rx.Observable.returnValue(state2);

				service.updateAll().subscribe();

				expect(service.latestBuildStates['Build1']).toEqual(state1);
				expect(service.latestBuildStates['Build2']).toEqual(state2);
			});

			it('should extend received build state', function () {
				var state = createStateForId('Build1');
				delete state.isDisabled;
				delete state.serviceName;
				delete state.serviceIcon;

				update1Response = Rx.Observable.returnValue(state);

				service.updateAll().subscribe();

				var storedState = service.latestBuildStates['Build1'];
				expect(storedState.isDisabled).toBe(false);
				expect(storedState.serviceName).toBe(settings.name);
				expect(storedState.serviceIcon).toBe(settings.icon);
			});

			it('should extend received build state from previous build if response unknown', function () {
				service.latestBuildStates['Build1'].isBroken = true;
				var state = createStateForId('Build1');
				delete state.isBroken;

				update1Response = Rx.Observable.returnValue(state);

				service.updateAll().subscribe();

				var storedState = service.latestBuildStates['Build1'];
				expect(storedState.isBroken).toBe(true);
			});

			it('should push update when no builds selected', function () {
				settings.projects = [];
				service = new CustomBuildService(settings);

				var completed = false;
				service.updateAll().subscribe(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should not fail if build update failed', function () {
				var state1 = createStateForId('Build1');
				var stateError = "Error";
				update1Response = Rx.Observable.returnValue(state1);
				update2Response = Rx.Observable.throwException(stateError);

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

			describe('build events', function () {

				var oldState;
				var newState;
				var eventsSubscription;

				beforeEach(function () {
					settings.projects = ['Build1'];
					service = new CustomBuildService(settings);
					events = [];
					eventsSubscription = service.events.subscribe(rememberEvent);
					oldState = service.latestBuildStates['Build1'];
					newState = createStateForId('Build1');
				});

				afterEach(function () {
					eventsSubscription.dispose();
				});

				it('should push updateError if build update failed', function () {
					var stateError = "Error";
					update1Response = Rx.Observable.throwException(stateError);

					service.updateAll().subscribe();

					expect(eventPushed('updateError')).toBe(true);
					expect(getLastEvent('updateError').details.error).toEqual(stateError);
				});

				it('should push buildBroken if build broken', function () {
					oldState.isBroken = false;
					newState.isBroken = true;
					update1Response = Rx.Observable.returnValue(newState);

					service.updateAll().subscribe();

					expect(eventPushed('buildBroken')).toBe(true);
					expect(getLastEvent('buildBroken').details).toEqual(newState);
				});

				it('should not push buildBroken if build already broken', function () {
					oldState.isBroken = true;
					newState.isBroken = true;
					update1Response = Rx.Observable.returnValue(newState);

					service.updateAll().subscribe();

					expect(eventPushed('buildBroken')).toBe(false);
				});

				it('should push buildFixed if build was fixed', function () {
					oldState.isBroken = true;
					newState.isBroken = false;
					update1Response = Rx.Observable.returnValue(newState);


					service.updateAll().subscribe();

					expect(eventPushed('buildFixed')).toBe(true);
					expect(getLastEvent('buildFixed').details).toEqual(newState);
				});

				it('should not push buildFixed if build was not broken', function () {
					oldState.isBroken = false;
					newState.isBroken = false;
					update1Response = Rx.Observable.returnValue(newState);

					service.updateAll().subscribe();

					expect(eventPushed('buildFixed')).toBe(false);
				});

				it('should push buildStarted if build started', function () {
					oldState.isRunning = false;
					newState.isRunning = true;
					update1Response = Rx.Observable.returnValue(newState);

					service.updateAll().subscribe();

					expect(eventPushed('buildStarted')).toBe(true);
					expect(getLastEvent('buildStarted').details).toEqual(newState);
				});

				it('should not push buildStarted if build already running', function () {
					oldState.isRunning = true;
					newState.isRunning = true;
					update1Response = Rx.Observable.returnValue(newState);

					service.updateAll().subscribe();

					expect(eventPushed('buildStarted')).toBe(false);
				});

				it('should push buildFinished if build finished', function () {
					oldState.isRunning = true;
					newState.isRunning = false;
					update1Response = Rx.Observable.returnValue(newState);

					service.updateAll().subscribe();

					expect(eventPushed('buildFinished')).toBe(true);
					expect(getLastEvent('buildFinished').details).toEqual(newState);
				});

				it('should not push buildFinished if build was not running', function () {
					oldState.isRunning = false;
					newState.isRunning = false;
					update1Response = Rx.Observable.returnValue(newState);

					service.updateAll().subscribe();

					expect(eventPushed('buildFinished')).toBe(false);
				});
			});
		});

		describe('start/stop', function () {

			var eventsSubscription;

			beforeEach(function () {
				service = new CustomBuildService(settings);
				eventsSubscription = service.events.subscribe(rememberEvent);
				var states = [createStateForId('Build1'), createStateForId('Build2')];
				spyOn(service, 'updateAll').andReturn(Rx.Observable.fromArray(states));
			});

			afterEach(function () {
				eventsSubscription.dispose();
				service.stop();
			});

			it('should not push serviceStopped if not started', function () {
				service.stop();

				expect(eventPushed('serviceStopped')).toBe(false);
			});

			it('should push serviceStarted on first finished update', function () {
				service.start().subscribe();

				expect(eventPushed('serviceStarted')).toBe(true);
				expect(getLastEvent('serviceStarted').details.length).toEqual(2);
			});

			it('should start once until stopped', function () {
				service.start().subscribe();
				service.start().subscribe();

				expect(getEvents('serviceStarted').length).toBe(1);
			});

			it('should push serviceStarted on first finished update', function () {
				service.start().subscribe();

				expect(eventPushed('serviceStarted')).toBe(true);
				expect(getLastEvent('serviceStarted').details.length).toEqual(2);
			});


		});
		
	});

});