import eventProcessor from 'core/services/buildEventProcessor';
import events from 'core/events';
import serviceConfiguration from 'core/config/serviceConfiguration';
import sortBy from 'common/sortBy';

let rxServiceUpdateFailed, rxServiceUpdated, rxServicesInit;

const init = () => {
    const latestState = new Map();
    let latestConfig = [];

    serviceConfiguration.changes.subscribe((config) => {
        latestConfig = config;
    });

    rxServiceUpdated = events.getByName('serviceUpdated').subscribe((ev) => {
        const oldState = latestState.get(ev.source) || { name: ev.source, items: [] };
        const newState = { name: ev.source, items: ev.details };
        newState.items = mixInPreviousState(oldState.items, newState.items);
        latestState.set(ev.source, newState);
        pushStateUpdated();
        eventProcessor.process({ oldState, newState });
    });

    const mixInPreviousState = (oldItems, newItems) => {
        return newItems.map((newBuild) => {
            const oldBuild = oldItems
                .filter((build) => build.id === newBuild.id)[0];
            return Object.assign({}, oldBuild, { error: null }, newBuild);
        });
    };

    rxServiceUpdateFailed = events.getByName('serviceUpdateFailed').subscribe((ev) => {
        const oldItems = latestState.get(ev.source).items;
        const items = oldItems.map((item) => {
            item.error = {
                message: 'Service update failed',
                description: ev.details ? ev.details.message : null
            };
            return item;
        });
        latestState.set(ev.source, { name: ev.source, items });
        pushStateUpdated();
    });

    rxServicesInit = events.getByName('servicesInitializing').subscribe((ev) => {
        latestState.clear();
        ev.details
            .filter((settings) => !settings.disabled)
            .forEach((settings) => {
                const initialState = createInitialStates(settings);
                latestState.set(settings.name, { name: settings.name, items: initialState });
            });
        pushStateUpdated();
    });

    const pushStateUpdated = () => {
        events.push({
            eventName: 'stateUpdated',
            source: 'serviceView',
            details: latestConfig
                .filter((config) => !config.disabled)
                .filter((config) => latestState.has(config.name))
                .map((service) => latestState.get(service.name))
                .map((state) => ({
                    name: state.name,
                    items: sortBy('id', state.items)
                }))
        });
    };
};

const dispose = () => {
    rxServiceUpdated.dispose();
    rxServiceUpdateFailed.dispose();
    rxServicesInit.dispose();
};

const createInitialStates = (settings) => settings.projects.map((id) => ({
    id,
    name: id,
    group: null,
    webUrl: null,
    isBroken: false,
    isRunning: false,
    isDisabled: false,
    tags: [],
    changes: [],
    error: null
}));

export default {
    init,
    dispose
};
