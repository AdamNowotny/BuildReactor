import 'rx/dist/rx.binding';
import Rx from 'rx';
import events from 'core/events';

let types = {};

const registerType = function (Service) {
    const settings = Service.settings();
    types[settings.baseUrl] = Service;
};

const clear = function () {
    types = {};
};

const typeInfoFor = name => {
    const service = services.filter(s => s.settings.name === name)[0];
    return types[service.settings.baseUrl].settings();
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

const start = function (configChanges) {
    configChanges.subscribe(settingsList => {
        events.push({
            eventName: 'servicesInitializing',
            source: 'serviceController',
            details: settingsList,
        });
        removeAll();
        startServices(settingsList).subscribe(() => {
            events.push({
                eventName: 'servicesInitialized',
                source: 'serviceController',
                details: settingsList,
            });
        });
    });
};

export default {
    start,
    registerType,
    typeInfoFor,
    clear,
};
