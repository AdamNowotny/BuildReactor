import Rx from 'rx';
import events from 'core/events';

let rxServiceUpdated;

const init = () => {
    const latestState = new Map();
    rxServiceUpdated = events.getByName('serviceUpdated').subscribe((ev) => {
        latestState.set(ev.source, { name: ev.source, items: ev.details });
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
