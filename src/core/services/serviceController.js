/* eslint no-console: 0 */

define([
	'core/config/serviceConfiguration',
	'core/services/serviceLoader',
	'rx',
	'rx.binding'
], function (serviceConfiguration, serviceLoader, Rx) {

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

	var settingsSubject = new Rx.ReplaySubject(1);
	var servicesSubject = new Rx.ReplaySubject(1);
	var activeProjectsSubject = new Rx.ReplaySubject(1);
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
			activeProjectsSubject.onNext([]);
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
	var configChangesSubscription;

	var start = function (configChanges) {
		// configChangesSubscription && configChangesSubscription.dispose();
		// configChangesSubscription = configChanges.subscribe(function (allConfig) {
		serviceConfiguration.changes.subscribeOn(Rx.Scheduler.timeout).subscribe(function (allConfig) {
			console.log('config', allConfig);
			settingsSubject.onNext(allConfig);
		}, function (e) {
			console.log('error', e);
		}, function (e) {
			console.log('completed', e);
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
