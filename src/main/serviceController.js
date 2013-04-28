define([
	'main/serviceLoader',
	'rx',
	'signals'
], function (serviceLoader, Rx, signals) {

	'use strict';

	var events = new Rx.Subject();
	var services = [];
	var subscriptions = [];
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

	var start = function (settingsList) {
		removeAll();
		events.onNext({
			eventName: 'servicesInitializing',
			source: 'serviceController',
			details: settingsList
		});
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
		start: start,
		events: events,
		activeProjects: activeProjects,
		getAllTypes: getAllTypes,
		registerType: registerType,
		clear: clear
	};
});
