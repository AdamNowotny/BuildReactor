import Rx from 'rx';
import requests from 'services/buildkite/buildkiteRequests';

export default {
    getInfo: () => ({
        typeName: 'BuildKite',
        baseUrl: 'buildkite',
        icon: 'services/buildkite/icon.png',
        logo: 'services/buildkite/logo.svg',
        fields: [
            { type: 'token', help: 'Permissions needed: read_builds, read_organizations, read_pipelines' },
            { type: 'branch' }
        ],
        defaultConfig: {
            baseUrl: 'buildkite',
            name: '',
            projects: [],
            token: '',
            updateInterval: 60,
            branch: 'main'
        }
    }),
    getAll: (settings) => requests.organizations(settings)
        .selectMany((org) => requests.pipelines(org.pipelines_url, settings)
            .select((pipeline) => ({
                id: `${org.slug}/${pipeline.slug}`,
                name: pipeline.name,
                group: org.name,
                isDisabled: false
            }))
        ),
    getLatest: (settings) => Rx.Observable.fromArray(settings.projects)
        .select((project) => createKey(project))
        .selectMany((key) => requests.latestBuild(key.org, key.pipeline, settings)
            .selectMany((latestBuild) => {
                if (['running', 'scheduled', 'canceled', 'canceling'].includes(latestBuild.state)) {
                    return requests.latestFinishedBuild(key.org, key.pipeline, settings)
                        .select((finishedBuild) => parseBuild(latestBuild, key, finishedBuild));
                } else {
                    return Rx.Observable.return(parseBuild(latestBuild, key));
                }
            })
            .catch((ex) => Rx.Observable.return(({
                id: key.id,
                name: key.pipeline,
                group: key.org,
                error: { message: ex.message }
            })))
        )
};

const createKey = (stringId) => {
    const [org, pipeline] = stringId.split('/');
    return {
        id: stringId,
        org,
        pipeline
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
