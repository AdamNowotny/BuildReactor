import 'rx/dist/rx.binding';
import Rx from 'rx';
import events from 'core/events';
import serviceTypes from 'core/services/serviceTypes';

let services = [];
let eventsSubscriptions = [];

function loadServices(settingsList) {
	return Rx.Observable.fromArray(settingsList)
		.where((settings) => settings.disabled !== true)
		.select((settings) => {
			const Service = serviceTypes.getAll()[settings.baseUrl];
			return new Service(settings);
		})
		.do((service) => {
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
	eventsSubscriptions.forEach((subscription) => {
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
	start
};
