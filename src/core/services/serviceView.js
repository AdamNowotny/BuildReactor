import Rx from 'rx';
import events from 'core/events';

let rxServiceUpdateFailed, rxServiceUpdated, rxServicesInit;

const init = () => {
    const latestState = new Map();
    rxServiceUpdated = events.getByName('serviceUpdated').subscribe((ev) => {
        latestState.set(ev.source, { name: ev.source, items: ev.details });
        pushStateUpdated();
    });

    rxServiceUpdateFailed = events.getByName('serviceUpdateFailed').subscribe((ev) => {
        const oldItems = latestState.get(ev.source).items;
        const items = oldItems.map((item) => {
            item.error = { message: 'Service update failed' };
            return item;
        });
        latestState.set(ev.source, { name: ev.source, items });
        pushStateUpdated();
    });

    rxServicesInit = events.getByName('servicesInitializing').subscribe((ev) => {
        // TODO: create initial state
        latestState.clear();
        pushStateUpdated();
    });

    const pushStateUpdated = () => {
        events.push({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: [...latestState.values()]
        });
    };
};

const dispose = () => {
    rxServiceUpdated.dispose();
    rxServiceUpdateFailed.dispose();
    rxServicesInit.dispose();
};

// [
//   name,
//   items: [{
//     id: id,
//     name: id,
//     group: null,
//     webUrl: null,
//     isBroken: false,
//     isRunning: false,
//     isDisabled: false,
//     serviceName: settings.name,
//     serviceIcon: serviceInfo.icon,
//     tags: [],
//     changes: []
//   }]
// ]
export default {
    init,
    dispose
};