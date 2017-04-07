import 'test/rxHelpers';
import 'rx/dist/rx.binding';
import Rx from 'rx/dist/rx.testing';
import controller from 'core/services/serviceController';
import events from 'core/events';

describe('core/services/serviceController', () => {

	let service;

	function CustomBuildService(settings) {
		service = this;
		this.events = new Rx.Subject();
		this.initialActiveProjects = {
			name: settings.name,
			items: []
		};
		this.activeProjects = new Rx.BehaviorSubject(this.initialActiveProjects);
		this.settings = settings;
	}
	CustomBuildService.prototype.start = function() {};
	CustomBuildService.prototype.stop = function() {};
	CustomBuildService.settings = () => settings;

	var settings;
	var serviceStartResponse;
	var scheduler;

	beforeEach(function() {
		settings = {
			baseUrl: 'test',
			url: 'http://www.example.com/',
			name: 'service name',
			projects: [],
			disabled: false
		};
		serviceStartResponse = Rx.Observable.return([]);
		spyOn(CustomBuildService.prototype, 'start').and.callFake(function() {
			this.events.onNext({ eventName: 'serviceStarted' });
			return serviceStartResponse;
		});
		spyOn(CustomBuildService.prototype, 'stop');
		controller.registerType(CustomBuildService);
		scheduler = new Rx.TestScheduler();

	});

	describe('start/stop', function() {

		it('should start services', function() {
			controller.start(Rx.Observable.return([settings]));

			expect(CustomBuildService.prototype.start).toHaveBeenCalled();
		});

		it('should not start disabled services', function() {
			settings.disabled = true;

			controller.start(Rx.Observable.return([settings]));

			expect(CustomBuildService.prototype.start).not.toHaveBeenCalled();
		});

		it('should subscribe to service events', function() {
			spyOn(events, 'push');
			controller.start(Rx.Observable.return([settings]));
			service.events.onNext({ eventName: 'someEvent' });

			expect(events.push).toHaveBeenCalledWith({
				eventName: 'someEvent'
			});
		});

		it('should push servicesInitializing when configuration is reset', function() {
			spyOn(events, 'push');

			controller.start(Rx.Observable.return([settings]));

			expect(events.push).toHaveBeenCalledWith({
				eventName: 'servicesInitializing',
				source: 'serviceController',
				details: [{
					baseUrl: 'test',
					url: 'http://www.example.com/',
					name: 'service name',
					projects: [],
					disabled: false
				}]
			});
		});

		it('should push servicesInitialized when all services started', function() {
			spyOn(events, 'push');
			serviceStartResponse = new Rx.Subject();
			CustomBuildService.prototype.start.and.callFake(() =>
				serviceStartResponse
			);

			controller.start(Rx.Observable.return([settings, settings]));

			service.events.onNext({ eventName: 'serviceStarted' });
			serviceStartResponse.onCompleted();

			expect(events.push).toHaveBeenCalledWith({
				eventName: 'servicesInitialized',
				source: 'serviceController',
				details: [{
					baseUrl: 'test',
					url: 'http://www.example.com/',
					name: 'service name',
					projects: [],
					disabled: false
				}, {
					baseUrl: 'test',
					url: 'http://www.example.com/',
					name: 'service name',
					projects: [],
					disabled: false
				}]
			});
		});

		it('should push servicesInitialized when no services configured', () => {
			spyOn(events, 'push');

			controller.start(Rx.Observable.return([settings]));

			expect(events.push).toHaveBeenCalledWith({
				eventName: 'servicesInitialized',
				source: 'serviceController',
				details: [{
					baseUrl: 'test',
					url: 'http://www.example.com/',
					name: 'service name',
					projects: [],
					disabled: false
				}]
			});
			expect(CustomBuildService.prototype.stop).toHaveBeenCalled();
		});

		it('should unsubscribe from events and stop old services', function() {
			spyOn(events, 'push');

			controller.start(Rx.Observable.return([settings]));

			expect(CustomBuildService.prototype.stop).toHaveBeenCalled();
		});

		it('should unsubscribe from events and stop old services if empty settings passed', () => {
			spyOn(events, 'push');

			const configs = Rx.Observable.fromArray([[settings], []]);
			controller.start(configs);
			service.events.onNext({ eventName: 'someEvent' });

			expect(CustomBuildService.prototype.stop).toHaveBeenCalled();
			expect(events.push).not.toHaveBeenCalledWith({ eventName: 'someEvent' });
		});

	});

	describe('registrations', () => {

		beforeEach(() => {
			controller.clear();
		});

		afterEach(() => {
			controller.clear();
		});

		it('should return empty array if no services registered', () => {
			const types = controller.getAllTypes();

			expect(types).toEqual([]);
		});

		it('should register service', function() {
			spyOn(CustomBuildService, 'settings').and.returnValue(settings);

			controller.registerType(CustomBuildService);

			expect(CustomBuildService.settings).toHaveBeenCalled();
		});

		it('should return registered services', () => {
			controller.registerType(CustomBuildService);

			const types = controller.getAllTypes();

			expect(types).toEqual([CustomBuildService.settings()]);
		});

		it('should clear registrations', () => {
			controller.registerType(CustomBuildService);

			controller.clear();

			expect(controller.getAllTypes()).toEqual([]);
		});
	});
});
