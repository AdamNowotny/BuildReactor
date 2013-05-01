define([
	'main/serviceController',
	'rx',
	'main/serviceLoader'
],
function (controller, Rx, serviceLoader) {

	'use strict';
	
	describe('serviceController', function () {

		function CustomBuildService(settings) {
			this.events = new Rx.Subject();
		}
		CustomBuildService.settings = function () {
			return {
				typeName: 'test'
			};
		};
		CustomBuildService.prototype.start = function () {};
		CustomBuildService.prototype.stop = function () {};
		CustomBuildService.prototype.activeProjects = function () {};

		var settings;
		var service;
		var serviceStartResponse;
		var events = [];
		var eventsSubscription;

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


		beforeEach(function () {
			events = [];
			settings = {
				baseUrl: 'test',
				url: 'http://www.example.com/',
				name: 'service name',
				icon: 'mocks/icon.png',
				logo: 'mocks/icon.png',
				projects: [],
				disabled: false
			};
			eventsSubscription = controller.events.subscribe(rememberEvent);
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
		});

		afterEach(function () {
			eventsSubscription.dispose();
		});

		it('should start services', function () {
			controller.start([settings]).subscribe();

			expect(CustomBuildService.prototype.start).toHaveBeenCalled();
		});

		it('should not start disabled services', function () {
			settings.disabled = true;
			
			controller.start([settings]).subscribe();

			expect(CustomBuildService.prototype.start).not.toHaveBeenCalled();
		});

		it('should subscribe to service events', function () {
			controller.start([settings]).subscribe();
			service.events.onNext({ eventName: 'someEvent'});

			expect(eventPushed('someEvent')).toBe(true);
		});

		it('should push servicesInitializing when configuration is reset', function () {
			controller.start([settings]).subscribe();

			expect(eventPushed('servicesInitializing')).toBe(true);
		});

		it('should push servicesInitialized when all services started', function () {
			CustomBuildService.prototype.start.andCallFake(function () {
				expect(eventPushed('servicesInitialized')).toBe(false);
				this.events.onNext({ eventName: 'serviceStarted' });
				return serviceStartResponse;
			});
			controller.start([settings, settings]).subscribe();

			expect(getEvents('servicesInitialized').length).toBe(1);
		});

		it('should push servicesInitialized when no services configured', function () {
			controller.start([]).subscribe();

			expect(eventPushed('servicesInitialized')).toBe(true);
		});

		it('should unsubscribe from events and stop old services', function () {
			controller.start([settings]).subscribe();

			controller.start([settings]).subscribe();
			service.events.onNext({ eventName: 'someEvent'});

			expect(CustomBuildService.prototype.stop).toHaveBeenCalled();
			expect(getEvents('someEvent').length).toBe(1);
		});

		it('should unsubscribe from events and stop old services if empty settings passed', function () {
			controller.start([settings]).subscribe();

			controller.start([]).subscribe();
			service.events.onNext({ eventName: 'someEvent'});

			expect(getEvents('someEvent').length).toBe(0);
		});

		describe('state', function () {

			it('should get project state from all services', function () {
				var activeProjects = { name: 'service 1' };
				spyOn(CustomBuildService.prototype, 'activeProjects').andReturn(activeProjects);
				controller.start([settings, settings]).subscribe();

				var projects = controller.activeProjects();

				expect(projects.length).toBe(2);
			});

			it('should push state on subscribe', function () {
				var activeProjects = { name: 'service 1' };
				spyOn(CustomBuildService.prototype, 'activeProjects').andReturn(activeProjects);
				controller.start([settings]).subscribe();

				var lastState;
				controller.currentState.subscribe(function (state) {
					lastState = state;
				});

				expect(lastState).toEqual([activeProjects]);
			});

			it('should push state on events that modify state', function () {
				var activeProjects = { name: 'service 1' };
				spyOn(CustomBuildService.prototype, 'activeProjects').andReturn(activeProjects);
				controller.start([settings]).subscribe();

				var states = [];
				controller.currentState.subscribe(function (state) {
					states.push(state);
				});
				service.events.onNext({ eventName: 'someEvent'});
				service.events.onNext({ eventName: 'someEvent'});
				service.events.onNext({ eventName: 'someEvent'});
				service.events.onNext({ eventName: 'servicesInitialized'});
				service.events.onNext({ eventName: 'buildBroken'});
				service.events.onNext({ eventName: 'buildFixed'});

				expect(states.length).toBe(4);
				expect(states[0]).toEqual([activeProjects]);
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