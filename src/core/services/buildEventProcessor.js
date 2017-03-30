import events from 'core/events';

const process = ({ oldState, newState }) => {
    newState.items.forEach((newBuild) => {
        if (newBuild.error && newBuild.error.name === 'UnauthorisedError') {
            events.push({
                eventName: 'passwordExpired',
                source: newState.name,
                details: newBuild
            });
        }
        if (newBuild.changes) {
            newBuild.changes = createUniqueChanges(newBuild.changes);
        }
        if (oldState && oldState.items.length) {
            const oldBuild = oldState.items.filter((build) => build.id === newBuild.id)[0];
            if (!oldBuild.isBroken && newBuild.isBroken) {
                events.push({
                    eventName: 'buildBroken',
                    source: newState.name,
                    details: newBuild
                });
            }
            if (oldBuild.isBroken && !newBuild.isBroken) {
                events.push({
                    eventName: 'buildFixed',
                    source: newState.name,
                    details: newBuild
                });
            }
            if (!oldBuild.error && newBuild.error) {
                events.push({
                    eventName: 'buildOffline',
                    source: newState.name,
                    details: newBuild
                });
            }
            if (oldBuild.error && !newBuild.error) {
                events.push({
                    eventName: 'buildOnline',
                    source: newState.name,
                    details: newBuild
                });
            }
        }
    });
};

const createUniqueChanges = (allChanges) => {
    return allChanges ? allChanges.reduce((changes, value) => {
        const alreadyAdded = changes
            .filter((change) => change.name === value.name).length > 0;
        if (!alreadyAdded) {
            changes.push(value);
        }
        return changes;
    }, []) : [];
};

export default {
    process
};
