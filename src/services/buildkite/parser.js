const parseBuild = (build, key) => {
    const org = key.org;
    const pipeline = key.pipeline;
    return {
        id: `${org}/${pipeline}`,
        name: pipeline,
        group: org,
        webUrl: build.web_url,
        isBroken: build.state === 'failed',
        isRunning: build.state === 'running',
        isWaiting: build.state === 'scheduled',
        isDisabled: false,
        tags: createTags(build),
        changes: build.creator
            ? [{ name: build.creator.name, message: build.message }]
            : []
    };
};

const createTags = (build) => {
    const tags = [];
    if (['canceled', 'canceling'].includes(build.state)) {
        tags.push({ name: 'Canceled', type: 'warning' });
    }
    if (build.state === 'not_run') {
        tags.push({ name: 'Not built', type: 'warning' });
    }
    return tags;
};

export default {
    parseBuild
};
