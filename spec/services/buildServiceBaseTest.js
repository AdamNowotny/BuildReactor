define([
	'services/buildServiceBase',
	'mout/object/mixIn',
	'rx',
	'rx.testing',
	'rxHelpers'
], function (BuildServiceBase, mixIn, Rx) {
	'use strict';

	var onNext = Rx.ReactiveTest.onNext;
	var onCompleted = Rx.ReactiveTest.onCompleted;
	var onError = Rx.ReactiveTest.onError;

	describe('services/buildServiceBase', function () {

		var settings;
		var service;
		var events = [];
		var eventsSubscription;
		var scheduler;

		beforeEach(function () {
			scheduler = new Rx.TestScheduler();
			settings = {
				typeName: 'custom',
				baseUrl: 'prefix',
				icon: 'base/icon.png',
				url: 'http://example.com/',
				name: 'Service name',
				projects: [ 'Build1', 'Build2']
			};
			spyOn(GenericBuild.prototype, 'update');
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

			var update1Response;
			var update2Response;
			var buildState1, buildState2;

			beforeEach(function () {
				buildState1 = createStateForId('Build1');
				buildState2 = createStateForId('Build2');
				service = new CustomBuildService(settings);
				update1Response = Rx.Observable.returnValue(buildState1);
				update2Response = Rx.Observable.returnValue(buildState2);
				var callCount = 0;
				GenericBuild.prototype.update.andCallFake(function () {
					callCount++;
					switch (callCount) {
					case 1:
						return update1Response;
					case 2:
						return update2Response;
					}
				});
			});

			it('should push lastest state even before subscription to activeProjects', function () {
				buildState1.isBroken = true;
				var startSubscription = service.start().subscribe();

				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages[0].value.value.items[0]).toEqual(buildState1);
				startSubscription.dispose();
			});

			it('should not push new state if service stopped', function () {
				var startSubscription = service.start().subscribe();
				service.stop();

				scheduler.scheduleAbsolute(300, function () {
					service.events.onNext({ eventName: 'someEvent triggering state update'});
				});
				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages).not.toHaveElementsAtTimes(300);
			});

			it('should return default build info before update', function () {
				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages.length).toBe(1);
				expect(result.messages[0].value.value.name).toBe(settings.name);
				expect(result.messages[0].value.value.items.length).toBe(2);
			});

			it('should return build info', function () {
				service.latestBuildStates['Build1'] = buildState1;
				service.latestBuildStates['Build2'] = buildState2;
				var startSubscription = service.start().subscribe();

				scheduler.scheduleAbsolute(300, function () {
					service.events.onNext({ eventName: 'someEvent'});
				});
				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				var state = {
					name: settings.name,
					items: [buildState1, buildState2]
				};
				expect(result.messages.length).toBe(2);
				expect(result.messages[1].value.value).toEqual(state);
				startSubscription.dispose();
			});

			it('should return empty if no projects monitored', function () {
				settings.projects = [];
				service = new CustomBuildService(settings);

				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages[0].value.value.items.length).toBe(0);
			});

		});

		describe('updateAll', function () {

			var update1Response;
			var update2Response;
			var eventsSubscription;
			var state1, state2;

			beforeEach(function () {
				state1 = createStateForId('Build1');
				state2 = createStateForId('Build2');
				service = new CustomBuildService(settings);
				eventsSubscription = service.events.subscribe(rememberEvent);
				update1Response = Rx.Observable.returnValue(state1);
				update2Response = Rx.Observable.returnValue(state2);
				var callCount = 0;
				GenericBuild.prototype.update.andCallFake(function () {
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
				var result = scheduler.startWithCreate(function () {
					return service.updateAll();
				});

				expect(result.messages).toHaveEqualElements(
					onNext(200, state1),
					onNext(200, state2),
					onCompleted(200)
				);
				expect(GenericBuild.prototype.update.callCount).toBe(settings.projects.length);
			});

			it('should remember new build state', function () {
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

				it('should push updateFailed if build update failed', function () {
					var stateError = "Error";
					update1Response = Rx.Observable.throwException(stateError);

					service.updateAll().subscribe();

					expect(eventPushed('updateFailed')).toBe(true);
					expect(getLastEvent('updateFailed').details.error).toEqual(stateError);
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
				expect(getLastEvent('serviceStarted').source).toEqual(settings.name);
				expect(getLastEvent('serviceStarted').details.length).toEqual(2);
			});

			it('should start once until stopped', function () {
				service.start().subscribe();
				service.start().subscribe();

				expect(getEvents('serviceStarted').length).toBe(1);
			});

		});
		
	});

});