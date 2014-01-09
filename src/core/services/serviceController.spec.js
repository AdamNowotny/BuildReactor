define([
	'core/services/serviceController',
	'rx',
	'core/services/serviceLoader',
	'mout/object/mixIn',
	'mout/object/equals',
	'mout/object/deepMatches',
	'test/rxHelpers',
	'rx.binding'
],
function (controller, Rx, serviceLoader, mixIn, equals, deepMatches) {

	'use strict';
	
	describe('core/services/serviceController', function () {

		function CustomBuildService(settings) {
			this.settings = settings;
			this.events = new Rx.Subject();
			this.initialActiveProjects = {
				name: settings.name,
				items: []
			};
			this.activeProjects = new Rx.BehaviorSubject(this.initialActiveProjects);
		}
		CustomBuildService.settings = function () {
			return {
				typeName: 'test'
			};
		};
		CustomBuildService.prototype.start = function () {};
		CustomBuildService.prototype.stop = function () {};

		var settings;
		var service;
		var serviceStartResponse;
		var scheduler;

		beforeEach(function () {
			settings = {
				baseUrl: 'test',
				url: 'http://www.example.com/',
				name: 'service name',
				icon: 'mocks/icon.png',
				logo: 'mocks/icon.png',
				projects: [],
				disabled: false
			};
			serviceStartResponse = Rx.Observable.returnValue([]);
			spyOn(CustomBuildService.prototype, 'start').andCallFake(function () {
				this.events.onNext({ eventName: 'serviceStarted' });
				return serviceStartResponse;
			});
			spyOn(CustomBuildService.prototype, 'stop');
			service = new CustomBuildService(settings);
			spyOn(serviceLoader, 'load').andCallFake(function (settings) {
				return Rx.Observable.returnValue(service);
			});
			scheduler = new Rx.TestScheduler();
		});

		describe('start/stop', function () {

			it('should start services', function () {
				controller.start(Rx.Observable.returnValue([settings]));

				expect(CustomBuildService.prototype.start).toHaveBeenCalled();
			});

			it('should not start disabled services', function () {
				settings.disabled = true;
				
				controller.start(Rx.Observable.returnValue([settings]));

				expect(CustomBuildService.prototype.start).not.toHaveBeenCalled();
			});


			it('should subscribe to service events', function () {
				scheduler.scheduleAbsolute(300, function () {
					controller.start(Rx.Observable.returnValue([settings]));
				});
				scheduler.scheduleAbsolute(400, function () {
					service.events.onNext({eventName: 'someEvent'});
				});

				var result = scheduler.startWithCreate(function () {
					return controller.events;
				});

				expect(result.messages).toHaveEvent('someEvent');
			});

			it('should push servicesInitializing when configuration is reset', function () {
				scheduler.scheduleAbsolute(300, function () {
					controller.start(Rx.Observable.returnValue([settings]));
				});
				var result = scheduler.startWithCreate(function () {
					return controller.events;
				});

				expect(result.messages).toHaveEvent('servicesInitializing');
			});

			it('should push servicesInitialized when all services started', function () {
				serviceStartResponse = new Rx.Subject();
				CustomBuildService.prototype.start.andCallFake(function () {
					return serviceStartResponse;
				});

				scheduler.scheduleAbsolute(300, function () {
					controller.start(Rx.Observable.returnValue([settings, settings]));
				});
				scheduler.scheduleAbsolute(400, function () {
					service.events.onNext({eventName: 'serviceStarted'});
					serviceStartResponse.onCompleted();
				});
				var result = scheduler.startWithCreate(function () {
					return controller.events;
				});

				expect(result.messages).toHaveEvent('servicesInitialized');
				expect(result.messages).not.toHaveEventBefore(400, 'servicesInitialized');
			});

			it('should push servicesInitialized when no services configured', function () {
				scheduler.scheduleAbsolute(300, function () {
					controller.start(Rx.Observable.returnValue([settings]));
				});
				var result = scheduler.startWithCreate(function () {
					return controller.events;
				});

				expect(result.messages).toHaveEvent('servicesInitialized');
			});

			it('should unsubscribe from events and stop old services', function () {
				var configs = Rx.Observable.fromArray([[settings], [settings]]);
				scheduler.scheduleAbsolute(300, function () {
					controller.start(Rx.Observable.returnValue([settings]));
				});
				scheduler.scheduleAbsolute(500, function () {
					service.events.onNext({eventName: 'someEvent'});
				});
				var result = scheduler.startWithCreate(function () {
					return controller.events;
				});

				expect(CustomBuildService.prototype.stop).toHaveBeenCalled();
				expect(result.messages).toHaveEvent('someEvent', 1);
			});

			it('should unsubscribe from events and stop old services if empty settings passed', function () {
				var configs = Rx.Observable.fromArray([[settings], []]);
				scheduler.scheduleAbsolute(300, function () {
					controller.start(configs);
				});
				scheduler.scheduleAbsolute(500, function () {
					service.events.onNext({eventName: 'someEvent'});
				});
				var result = scheduler.startWithCreate(function () {
					return controller.events;
				});

				expect(CustomBuildService.prototype.stop).toHaveBeenCalled();
				expect(result.messages).not.toHaveEvent('someEvent');
			});

		});

		describe('activeProjects', function () {

			var onNext = Rx.ReactiveTest.onNext;

			it('should push state on subscribe', function () {
				controller.start(Rx.Observable.returnValue([settings]));

				var result = scheduler.startWithCreate(function () {
					return controller.activeProjects;
				});

				expect(result.messages).toHaveEqualElements(onNext(200, [service.initialActiveProjects]));
			});

			it('should get project state from all services', function () {
				var settings1 = mixIn({}, settings, { name: 'service 1'});
				var settings2 = mixIn({}, settings, { name: 'service 2'});
				var service1 = new CustomBuildService(settings1);
				var service2 = new CustomBuildService(settings2);
				serviceLoader.load.andCallFake(function (settings) {
					return settings.name === 'service 1' ?
						Rx.Observable.returnValue(service1) :
						Rx.Observable.returnValue(service2);
				});

				scheduler.scheduleAbsolute(200, function () {
					controller.start(Rx.Observable.returnValue([settings1, settings2]));
				});
				scheduler.scheduleAbsolute(300, function () {
					service1.activeProjects.onNext({ name: 'service 1', items: [{ id: 'id1'}] });
				});
				scheduler.scheduleAbsolute(400, function () {
					service2.activeProjects.onNext({ name: 'service 2', items: [{ id: 'id2'}] });
				});
				var result = scheduler.startWithCreate(function () {
					return controller.activeProjects;
				});

				expect(result.messages).toHaveEqualElements(
					onNext(200, [{ name: 'service 1', items: [] }, { name: 'service 2', items: [] }]),
					onNext(300, [{ name: 'service 1', items: [{ id: 'id1'}] }, { name: 'service 2', items: [] }]),
					onNext(400, [{ name: 'service 1', items: [{ id: 'id1'}] }, { name: 'service 2', items: [{ id: 'id2'}] }])
				);
			});

			it('should push empty list of projects when services disabled', function () {
				scheduler.scheduleAbsolute(300, function () {
					settings.disabled = true;
					controller.start(Rx.Observable.returnValue([settings]));
				});
				var result = scheduler.startWithCreate(function () {
					return controller.activeProjects;
				});

				expect(result.messages).toHaveElements(onNext(300, []));
			});

		});

		describe('registrations', function () {

			afterEach(function () {
				controller.clear();
			});

			it('should return empty array if no services registered', function () {
				var types = controller.getAllTypes();

				expect(types.length).toBe(0);
			});

			it('should register service', function () {
				spyOn(CustomBuildService, 'settings');

				controller.registerType(CustomBuildService);

				expect(CustomBuildService.settings).toHaveBeenCalled();
			});

			it('should return registered services settings', function () {
				controller.registerType(CustomBuildService);

				var types = controller.getAllTypes();

				expect(types.length).toBe(1);
				expect(types[0].typeName).toBe(CustomBuildService.settings().typeName);
			});

			it('should clear registrations', function () {
				controller.registerType(CustomBuildService);

				controller.clear();

				expect(controller.getAllTypes().length).toBe(0);
			});
		});
	});

});