import 'rx/dist/rx.binding';
import Rx from 'rx';
import events from 'core/events';

let types = {};

const getAllTypes = function() {
	const settingList = Object.keys(types)
		.map((k) => types[k])
		.map((t) => t.settings());
	return settingList;
};

const registerType = function(Service) {
	const settings = Service.settings();
	types[settings.baseUrl] = Service;
};

const clear = function() {
	types = {};
};

const typeInfoFor = (name) => {
	const service = services.filter((s) => s.settings.name === name)[0];
	return types[service.settings.baseUrl].settings();
};

const createService = (settings) => {
	const Service = types[settings.baseUrl];
	return new Service(settings);
};

var services = [];
var eventsSubscriptions = [];

function loadServices(settingsList) {
	return Rx.Observable.fromArray(settingsList)
		.where((settings) => settings.disabled !== true)
		.select((settings) => createService(settings))
		.do(function(service) {
			services.push(service);
			eventsSubscriptions.push(service.events.subscribe((event) => {
				events.push(event);
			}));
		})
		.toArray();
}

function startServices(settingsList) {
	return loadServices(settingsList)
		.selectMany((serviceList) => Rx.Observable.fromArray(serviceList)
			.selectMany((service) => service.start()
				.do((items) => {
					events.push({
						eventName: 'serviceStarted',
						source: service.settings.name,
						details: items
					});
				})
			)).toArray();
}

function removeAll() {
	services.forEach((service) => {
		service.stop();
		events.push({
			eventName: 'serviceStopped',
			source: service.settings.name
		});
	});
	eventsSubscriptions.forEach(function(subscription) {
		subscription.dispose();
	});
	services = [];
	eventsSubscriptions = [];
}

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

export default {
	start,
	getAllTypes,
	registerType,
	typeInfoFor,
	createService,
	clear
};
