define([
	'main/serviceLoader',
	'rx',
	'mout/array/contains'
], function (serviceLoader, Rx, contains) {

	'use strict';

	var services = [];
	var subscriptions = [];
	var types = [];
	var events = new Rx.Subject();
	var currentState = Rx.Observable.defer(function () {
			return Rx.Observable.returnValue(activeProjects());
		}).merge(events.where(function (event) {
			return contains([
				'servicesInitialized',
				'updateFailed',
				'buildBroken',
				'buildFixed',
				'buildStarted',
				'buildFinished'
			], event.eventName);
		}).select(function () {
			return activeProjects();
		}));

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

	var start = function (settingsList) {
		events.onNext({
			eventName: 'servicesInitializing',
			source: 'serviceController',
			details: settingsList
		});
		removeAll();
		return Rx.Observable.fromArray(settingsList)
			.where(function (settings) {
				return settings.disabled !== true;
			})
			.selectMany(serviceLoader.load)
			.doAction(function (service) {
				services.push(service);
				subscriptions.push(service.events.subscribe(events));
			}).selectMany(function (service) {
				return service.start();
			}).toArray()
			.doAction(function (buildStates) {
				events.onNext({
					eventName: 'servicesInitialized',
					source: 'serviceController'
				});
			});
	};

	var removeAll = function () {
		services.forEach(function (service) { 
			service.stop();
		});
		subscriptions.forEach(function (subscription) { 
			subscription.dispose();
		});
		services = [];
		subscriptions = [];
	};

	function activeProjects() {
		return services.map(function (service) {
			return service.activeProjects();
		});
	}

	return {
		events: events,
		currentState: currentState,
		start: start,
		activeProjects: activeProjects,
		getAllTypes: getAllTypes,
		registerType: registerType,
		clear: clear
	};
});
