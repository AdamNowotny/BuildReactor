define([
	'core/services/serviceLoader',
	'rx',
	'mout/array/contains',
	'mout/object/values',
	'rx.binding'
], function (serviceLoader, Rx, contains, values) {

	'use strict';

	var types = [];

	var getAllTypes = function () {
		return types;
	};

	var registerType = function (Service) {
		var settings = Service.settings();
		types.push(settings);
	};

	var clear = function () {
		types = [];
	};

	var services = [];
	var eventsSubscriptions = [];
	var events = new Rx.Subject();

	var settingsSubject = new Rx.BehaviorSubject([]);
	var servicesSubject = new Rx.BehaviorSubject([]);
	var activeProjectsSubject = new Rx.BehaviorSubject([]);
	var activeProjectsSubscription;

	settingsSubject.subscribe(function (settingsList) {
		events.onNext({
			eventName: 'servicesInitializing',
			source: 'serviceController',
			details: settingsList
		});
		removeAll();
		startServices(settingsList).subscribe(function () {
			events.onNext({
				eventName: 'servicesInitialized',
				source: 'serviceController',
				details: settingsList
			});
		});
	});

	function loadServices(settingsList) {
		return Rx.Observable.fromArray(settingsList)
			.where(function (settings) {
				return settings.disabled !== true;
			}).selectMany(function (settings) {
				return serviceLoader.load(settings);
			}).doAction(function (service) {
				services.push(service);
				eventsSubscriptions.push(service.events.subscribe(events));
			}).toArray();
	}

	function startServices(settingsList) {
		return loadServices(settingsList).doAction(function (services) {
				servicesSubject.onNext(services);
			}).selectMany(function (services) {
				return Rx.Observable.fromArray(services)
					.selectMany(function (service) {
						return service.start();
					});
			}).toArray();
	}

	function removeAll() {
		services.forEach(function (service) {
			service.stop();
		});
		eventsSubscriptions.forEach(function (subscription) { 
			subscription.dispose();
		});
		services = [];
		eventsSubscriptions = [];
	}

	servicesSubject.subscribe(function (services) {
		if (activeProjectsSubscription) {
			activeProjectsSubscription.dispose();
		}
		if (services.length === 0) {
			return;
		}
		activeProjectsSubscription = Rx.Observable
			.combineLatest(services.map(function (service) {
				return service.activeProjects;
			}), function () {
				var states = Array.prototype.slice.call(arguments, 0);
				return states;
			}).subscribe(activeProjectsSubject);
	});

	var start = function (configChanges) {
		configChanges.subscribe(function (allConfig) {
			settingsSubject.onNext(allConfig);
		});
	};

	return {
		events: events,
		activeProjects: activeProjectsSubject,
		start: start,
		getAllTypes: getAllTypes,
		registerType: registerType,
		clear: clear
	};
});
