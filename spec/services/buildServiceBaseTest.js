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

		var scheduler;
		var settings, service;
		var update1Response, update2Response;
		var buildState1, buildState2;

		beforeEach(function () {
			scheduler = new Rx.TestScheduler();
			scheduler.scheduleAbsolute(2000, function () {
				scheduler.stop();
			});
			settings = {
				typeName: 'custom',
				baseUrl: 'prefix',
				icon: 'base/icon.png',
				url: 'http://example.com/',
				name: 'Service name',
				projects: [ 'Build1', 'Build2'],
				updateInterval: 1
			};
			buildState1 = createStateForId('Build1');
			buildState2 = createStateForId('Build2');
			update1Response = Rx.Observable.returnValue(buildState1);
			update2Response = Rx.Observable.returnValue(buildState2);
			var callCount = 0;
			spyOn(GenericBuild.prototype, 'update').andCallFake(function () {
				callCount++;
				switch (callCount) {
				case 1:
					return update1Response;
				case 2:
					return update2Response;
				}
			});
			service = new CustomBuildService(settings);
		});

		function CustomBuildService() {
			mixIn(this, new BuildServiceBase(settings, scheduler));
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
				serviceName: settings.name,
				serviceIcon: settings.icon
			};
		}

		var createDefaultState = function (id) {
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

		describe('activeProjects', function () {

			it('should push default build state before start', function () {
				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages).toHaveEqualElements(onNext(200, {
					name: settings.name,
					items: [createDefaultState('Build1'), createDefaultState('Build2')]
				}));

				expect(GenericBuild.prototype.update).not.toHaveBeenCalled();
			});

			it('should push lastest state on activeProjects subscription', function () {
				service.start().subscribe();

				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages).toHaveEqualElements(onNext(200, {
					name: settings.name,
					items: [buildState1, buildState2]
				}));
			});

			it('should push updated build states every time an event is published', function () {
				service.start().subscribe();

				scheduler.scheduleAbsolute(300, function () {
					service.events.onNext({ eventName: 'someEvent'});
				});
				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages).toHaveElements(onNext(300, {
					name: settings.name,
					items: [buildState1, buildState2]
				}));
			});

			it('should not push new state if service stopped', function () {
				service.start().subscribe();
				service.stop();

				scheduler.scheduleAbsolute(300, function () {
					service.events.onNext({ eventName: 'someEvent triggering state update'});
				});
				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages).not.toHaveElementsAtTimes(300);
			});

			it('should return empty if no projects monitored', function () {
				settings.projects = [];
				service = new CustomBuildService(settings);
				service.start().subscribe();

				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages).toHaveEqualElements(onNext(200, {
					name: settings.name,
					items: []
				}));
				expect(GenericBuild.prototype.update).not.toHaveBeenCalled();
			});

			it('should push latest state on update', function () {
				update1Response = new Rx.Subject();
				update2Response = new Rx.Subject();
				buildState1.isRunning = true;
				service.start().subscribe();

				scheduler.scheduleAbsolute(300, function () {
					update1Response.onNext(buildState1);
					update1Response.onCompleted();
				});
				scheduler.scheduleAbsolute(400, function () {
					update2Response.onNext(buildState2);
					update2Response.onCompleted();
				});
				var result = scheduler.startWithCreate(function () {
					return service.activeProjects;
				});

				expect(result.messages).toHaveElements(
					onNext(300, { name: settings.name, items: [buildState1, createDefaultState('Build2')] }),
					onNext(400, { name: settings.name, items: [buildState1, buildState2] })
				);
			});

		});

		describe('updateAll', function () {

			it('should update builds', function () {
				var result = scheduler.startWithCreate(function () {
					return service.updateAll();
				});

				expect(result.messages).toHaveEqualElements(
					onNext(200, buildState1),
					onNext(200, buildState2),
					onCompleted(200)
				);
				expect(GenericBuild.prototype.update.callCount).toBe(settings.projects.length);
			});

			it('should extend received build state with last known values as default', function () {
				delete buildState1.isDisabled;
				delete buildState1.serviceName;
				delete buildState1.serviceIcon;

				var result = scheduler.startWithCreate(function () {
					return service.updateAll();
				});

				var state = createStateForId('Build1');
				var defaultState = createDefaultState('Build1');
				state.isDisabled = defaultState.isDisabled;
				state.serviceName = defaultState.serviceName;
				state.serviceIcon = defaultState.serviceIcon;
				expect(result.messages).toHaveEqualElements(
					onNext(200, state),
					onNext(200, buildState2),
					onCompleted(200)
				);
			});

			it('should complete when no builds selected', function () {
				settings.projects = [];
				service = new CustomBuildService(settings);

				var result = scheduler.startWithCreate(function () {
					return service.updateAll();
				});

				expect(result.messages).toHaveEqualElements(onCompleted(200));
			});

			it('should not fail if build update failed', function () {
				update2Response = new Rx.Subject();

				scheduler.scheduleAbsolute(300, function () {
					update2Response.onError("error");
				});
				var result = scheduler.startWithCreate(function () {
					return service.updateAll();
				});

				expect(result.messages).toHaveEqualElements(
					onNext(200, buildState1),
					onNext(300, mixIn(createDefaultState('Build2'), { error : 'error' })),
					onCompleted(300)
				);
			});

			describe('build events', function () {

				var oldState, newState;

				beforeEach(function () {
					update1Response = new Rx.Subject();
					oldState = createStateForId('Build1');
					newState = createStateForId('Build1');
					scheduler.scheduleAbsolute(200, function () {
						service.latestBuildStates['Build1'] = oldState;
						service.updateAll().subscribe();
					});
					scheduler.scheduleAbsolute(500, function () {
						update1Response.onNext(newState);
					});
				});

				it('should push buildOffline if build update failed', function () {
					scheduler.scheduleAbsolute(500, function () {
						update1Response.onError("error");
					});
					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).toHaveElements(
						onNext(500, { eventName: 'buildOffline', details: mixIn(buildState1, { error: 'error'}) })
					);
				});

				it('should push buildOnline if build update succeeds after failure', function () {
					oldState.error = { message: 'Ajax error', httpStatus: 500 };

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).toHaveElements(
						onNext(500, { eventName: 'buildOnline', details: newState })
					);
				});

				it('should push buildBroken if build broken', function () {
					oldState.isBroken = false;
					newState.isBroken = true;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).toHaveElements(
						onNext(500, { eventName: 'buildBroken', details: newState })
					);
				});

				it('should not push buildBroken if build already broken', function () {
					oldState.isBroken = true;
					newState.isBroken = true;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).not.toHaveEvent('buildBroken');
				});

				it('should push buildFixed if build was fixed', function () {
					oldState.isBroken = true;
					newState.isBroken = false;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).toHaveElements(
						onNext(500, { eventName: 'buildFixed', details: newState })
					);
				});

				it('should not push buildFixed if build was not broken', function () {
					oldState.isBroken = false;
					newState.isBroken = false;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).not.toHaveEvent('buildFixed');
				});

				it('should push buildStarted if build started', function () {
					oldState.isRunning = false;
					newState.isRunning = true;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).toHaveElements(
						onNext(500, { eventName: 'buildStarted', details: newState })
					);
				});

				it('should not push buildStarted if build already running', function () {
					oldState.isRunning = true;
					newState.isRunning = true;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).not.toHaveEvent('buildStarted');
				});

				it('should push buildFinished if build finished', function () {
					oldState.isRunning = true;
					newState.isRunning = false;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).toHaveElements(
						onNext(500, { eventName: 'buildFinished', details: newState })
					);
				});

				it('should not push buildFinished if build was not running', function () {
					oldState.isRunning = false;
					newState.isRunning = false;

					var result = scheduler.startWithCreate(function () {
						return service.events;
					});

					expect(result.messages).not.toHaveEvent('buildFinished');
				});
			});
		});

		describe('start/stop', function () {

			afterEach(function () {
				service.stop();
			});

			it('should fail if updateInterval not defined', function () {
				delete settings.updateInterval;

				expect(function () {
					service.start();
				}).toThrow({name: 'ArgumentInvalid', message: 'updateInterval not defined'});
			});

			it('should push serviceStarted on first finished update', function () {
				scheduler.scheduleAbsolute(500, function () {
					service.start().subscribe();
				});
				var result = scheduler.startWithCreate(function () {
					return service.events;
				});

				expect(result.messages).toHaveEqualElements(
					onNext(501, {
						eventName: 'serviceStarted',
						source: settings.name,
						details: [buildState1, buildState2]
					}
				));
			});

			it('should start only once', function () {
				scheduler.scheduleAbsolute(300, function () {
					service.start().subscribe();
				});
				scheduler.scheduleAbsolute(500, function () {
					service.start().subscribe();
				});
				var result = scheduler.startWithCreate(function () {
					return service.events;
				});

				expect(result.messages).toHaveEqualElements(
					onNext(301, {
						eventName: 'serviceStarted',
						source: settings.name,
						details: [buildState1, buildState2]
					})
				);
			});

			it('should push serviceStopped on stop', function () {
				scheduler.scheduleAbsolute(300, function () {
					service.start().subscribe();
				});
				scheduler.scheduleAbsolute(500, function () {
					service.stop();
				});
				var result = scheduler.startWithCreate(function () {
					return service.events;
				});

				expect(result.messages).toHaveEqualElements(
					onNext(301, {
						eventName: 'serviceStarted',
						source: settings.name,
						details: [buildState1, buildState2]
					}),
					onNext(500, { eventName: 'serviceStopped', source: settings.name })
				);
			});

			it('should not push serviceStopped if not started', function () {
				scheduler.scheduleAbsolute(500, function () {
					service.stop();
				});
				var result = scheduler.startWithCreate(function () {
					return service.events;
				});

				expect(result.messages).not.toHaveEvent('serviceStopped');
			});

		});
		
	});

});