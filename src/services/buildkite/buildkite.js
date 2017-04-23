import Rx from 'rx';
import requests from 'services/buildkite/buildkiteRequests';

const getAll = (settings) => requests.organizations(settings.token)
    .selectMany((org) => requests.pipelines(org.pipelines_url, settings.token)
        .select((pipeline) => parsePipeline(org, pipeline))
    );

const parsePipeline = (org, pipeline) => ({
    id: `${org.slug}/${pipeline.slug}`,
    name: pipeline.name,
    group: org.name,
    isDisabled: false
});

const getLatest = (settings) => Rx.Observable.fromArray(settings.projects)
    .select((project) => createKey(project))
    .selectMany((key) => requests.latestBuild(key.org, key.pipeline, settings.token)
        .selectMany((latestBuild) => {
            if (['running', 'scheduled', 'canceled', 'canceling'].includes(latestBuild.state)) {
                return requests.latestFinishedBuild(key.org, key.pipeline, settings.token)
                    .select((finishedBuild) => parseBuild(latestBuild, key, finishedBuild));
            } else {
                return Rx.Observable.return(parseBuild(latestBuild, key));
            }
        })
        .catch((ex) => Rx.Observable.return(createError(key, ex)))
    );

const createKey = (stringId) => {
    const [org, pipeline] = stringId.split('/');
    return {
        id: stringId,
        org,
        pipeline
    };
};

const createError = (key, ex) => ({
    id: key.id,
    name: key.pipeline,
    group: key.org,
    error: ex
});

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
        changes: latestBuild.creator ?
            [{
                name: latestBuild.creator.name,
                message: latestBuild.message
            }] : []
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
    getLatest,
    getInfo: () => ({
        typeName: 'BuildKite',
        baseUrl: 'buildkite',
        icon: 'services/buildkite/icon.png',
        logo: 'services/buildkite/logo.svg',
        defaultConfig: {
            baseUrl: 'buildkite',
            name: '',
            projects: [],
            token: '',
            updateInterval: 60
        }
    })
};
