import 'rx/dist/rx.binding';
import Rx from 'rx';
import events from 'core/events';
import logger from 'common/logger';
import serviceConfig from 'service-worker/service-config';

let types = {};

const registerType = function (Service) {
    const settings = Service.settings();
    types[settings.baseUrl] = Service;
};

const clear = function () {
    types = {};
};

const createService = settings => {
    const Service = types[settings.baseUrl];
    return new Service(settings);
};

let services = [];
let eventsSubscriptions = [];

function loadServices(settingsList) {
    return Rx.Observable.fromArray(settingsList)
        .where(settings => settings.disabled !== true)
        .select(settings => createService(settings))
        .do(service => {
            services.push(service);
            eventsSubscriptions.push(
                service.events.subscribe(event => {
                    events.push(event);
                })
            );
        })
        .toArray();
}

function startServices(settingsList) {
    return loadServices(settingsList)
        .selectMany(serviceList =>
            Rx.Observable.fromArray(serviceList).selectMany(service => service.start())
        )
        .toArray();
}

function removeAll() {
    services.forEach(service => service.stop());
    eventsSubscriptions.forEach(subscription => subscription.dispose());
    services = [];
    eventsSubscriptions = [];
}

const start = function () {
    serviceConfig.onChanged.subscribe(settingsList => {
        events.push({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: settingsList.newValue,
        });
        removeAll();
        startServices(settingsList.newValue).subscribe((a) => {
			logger.log('servicesInitialized', a);
		});
    });
};

export default {
    start,
    registerType,
    clear,
};
