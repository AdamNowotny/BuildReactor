import events from 'core/events';

const process = ({ oldState, newState }) => {
    newState?.items?.forEach((newBuild) => {
        if (newBuild.changes) {
            newBuild.changes = createUniqueChanges(newBuild.changes);
        }
        if (oldState?.items?.length) {
            const [oldBuild] = oldState.items.filter((build) => build.id === newBuild.id);
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
