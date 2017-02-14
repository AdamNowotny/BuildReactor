import Rx from 'rx';
import requests from 'services/buildkite/buildkiteRequests';
import sortBy from 'common/sortBy';

const getAll = (settings) => {
    const token = settings.token;
    return requests.organizations(token)
        .selectMany((org) => requests.pipelines(org.pipelines_url, token)
            .select((pipeline) => parsePipeline(org, pipeline))
        )
        .toArray()
        .select((items) => sortBy('id', items))
        .select((items) => ({ items }));
};

const parsePipeline = (org, pipeline) => ({
    id: `${org.slug}/${pipeline.slug}`,
    name: pipeline.name,
    group: org.name,
    isDisabled: false
});

const getLatest = (settings) => {
    const token = settings.token;
    const projects = settings.projects;
    return Rx.Observable.fromArray(projects)
        .select((project) => createKey(project))
        .selectMany((key) => requests.latestBuild(key.org, key.pipeline, token)
            .selectMany((latestBuild) => {
                if (['running', 'scheduled', 'canceled', 'canceling'].includes(latestBuild.state)) {
                    return requests.latestFinishedBuild(key.org, key.pipeline, token)
                        .select((finishedBuild) => parseBuild(latestBuild, key, finishedBuild));
                } else {
                    return Rx.Observable.return(parseBuild(latestBuild, key));
                }
            }))
        .reduce((result, x, idx, source) => result.concat(x), [])
        .select((items) => ({ items }));
};

const createKey = (stringId) => {
    const idArray = stringId.split('/');
    return {
        org: idArray[0],
        pipeline: idArray[1]
    };
};

const parseBuild = (latestBuild, key, finishedBuild) => {
    const org = key.org;
    const pipeline = key.pipeline;
    const primaryBuild = (finishedBuild || latestBuild);
    return {
        id: `${org}/${pipeline}`,
        name: pipeline,
        group: org,
        webUrl: latestBuild.web_url,
        isBroken: primaryBuild.state === 'failed',
        isRunning: latestBuild.state === 'running',
        isWaiting: latestBuild.state === 'scheduled',
        isDisabled: false,
        tags: createTags(latestBuild),
        changes: latestBuild.creator
            ? [{ name: latestBuild.creator.name, message: latestBuild.message }]
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
    getAll,
    getLatest
};
