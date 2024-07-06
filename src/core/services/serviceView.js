import eventProcessor from 'core/services/buildEventProcessor';
import events from 'core/events';
import stateStorage from 'service-worker/state-storage';

let rxServiceUpdateFailed, rxServiceUpdated, rxServicesInit;

const init = () => {
    const latestState = new Map();

    rxServiceUpdated = events.getByName('serviceUpdated').subscribe((ev) => {
        const oldState = getState(ev.source);
        updateState(ev.source, ev.details);
        saveState();
        const newState = getState(ev.source);
        eventProcessor.process({ oldState, newState });
    });

    rxServiceUpdateFailed = events.getByName('serviceUpdateFailed').subscribe((ev) => {
        const items = getState(ev.source).items.map((item) => {
            item.error = {
                message: 'Service update failed',
                description: ev.details ? ev.details.message : null
            };
            return item;
        });
        updateState(ev.source, items);
        saveState();
    });

    rxServicesInit = events.getByName('servicesInitializing').subscribe((ev) => {
        latestState.clear();
    });

    const getState = (serviceName) => JSON.parse(JSON.stringify(latestState.get(serviceName)));

    const updateState = (serviceName, items) => {
        var updatedItems = items;
        if (latestState.has(serviceName)) {
            const orderedItems = getState(serviceName).items;
            updatedItems = orderedItems.map((oldItem) => {
                const newItem = items.filter((item) => item.id === oldItem.id)[0];
                return Object.assign(oldItem, { error: null }, newItem);
            });
        }
        latestState.set(serviceName, {
            name: serviceName,
            failedCount: updatedItems.filter((i) => i.isBroken && !i.isDisabled).length,
            offlineCount: updatedItems.filter((i) => i.error && !i.isDisabled).length,
            runningCount: updatedItems.filter((i) => i.isRunning && !i.isDisabled).length,
            items: updatedItems
        });
    };

    const saveState = () => {
        void stateStorage.set([...latestState.values()]);
    };
};

const dispose = () => {
    rxServiceUpdated.dispose();
    rxServiceUpdateFailed.dispose();
    rxServicesInit.dispose();
};

export default {
    init,
    dispose
};
