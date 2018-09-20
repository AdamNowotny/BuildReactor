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
            if (!oldBuild.isRunning && newBuild.isRunning) {
                events.push({
                    eventName: 'buildStarted',
                    source: newState.name,
                    details: newBuild
                });
            }
            if (oldBuild.isRunning && !newBuild.isRunning) {
                events.push({
                    eventName: 'buildFinished',
                    source: newState.name,
                    details: newBuild,
                    broken: !oldBuild.isBroken && newBuild.isBroken,
                    fixed: oldBuild.isBroken && !newBuild.isBroken
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
