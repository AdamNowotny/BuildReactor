import events from 'core/events';

define([
	'rx',
	'rx/dist/rx.binding'
], function(Rx) {

	'use strict';

	var types = {};

	var getAllTypes = function() {
		return types;
	};

	var registerType = function(Service) {
		var settings = Service.settings();
		types[settings.baseUrl] = Service;
	};

	var clear = function() {
		types = {};
	};

	var services = [];
	var eventsSubscriptions = [];

	var servicesSubject = new Rx.ReplaySubject(1);
	var activeProjectsSubject = new Rx.ReplaySubject(1);
	var activeProjectsSubscription;

	function loadServices(settingsList) {
		return Rx.Observable.fromArray(settingsList)
			.where(function(settings) {
				return settings.disabled !== true;
			})
			.select(function(settings) {
				const Service = types[settings.baseUrl];
				return new Service(settings);
			})
			.do(function(service) {
				services.push(service);
				eventsSubscriptions.push(service.events.subscribe((event) => {
					events.push(event);
				}));
			})
			.toArray();
	}

	function startServices(settingsList) {
		return loadServices(settingsList).do(function(services) {
				servicesSubject.onNext(services);
			}).selectMany(function(services) {
				return Rx.Observable.fromArray(services)
					.selectMany(function(service) {
						return service.start();
					});
			}).toArray();
	}

	function removeAll() {
		services.forEach(function(service) {
			service.stop();
		});
		eventsSubscriptions.forEach(function(subscription) {
			subscription.dispose();
		});
		services = [];
		eventsSubscriptions = [];
	}

	servicesSubject.subscribe(function(services) {
		if (activeProjectsSubscription) {
			activeProjectsSubscription.dispose();
		}
		if (services.length === 0) {
			activeProjectsSubject.onNext([]);
			return;
		}
		activeProjectsSubscription = Rx.Observable
			.combineLatest(services.map(function(service) {
				return service.activeProjects;
			}), function() {
				var states = Array.prototype.slice.call(arguments, 0);
				return states;
			}).subscribe(activeProjectsSubject);
	});

	const start = function(configChanges) {
		configChanges.subscribe((settingsList) => {
			events.push({
				eventName: 'servicesInitializing',
				source: 'serviceController',
				details: settingsList
			});
			removeAll();
			startServices(settingsList).subscribe(() => {
				events.push({
					eventName: 'servicesInitialized',
					source: 'serviceController',
					details: settingsList
				});
			});
		});
	};

	return {
		activeProjects: activeProjectsSubject,
		start,
		getAllTypes,
		registerType,
		clear
	};
});
