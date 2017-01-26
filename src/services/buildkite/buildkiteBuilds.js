import Rx from 'rx';
import parser from 'services/buildkite/parser';
import requests from 'services/buildkite/buildkiteRequests';

const getAll = (settings) => {
    const token = settings.token;
    return requests.organizations(token)
        .selectMany((orgs) => Rx.Observable.fromArray(orgs)
            .selectMany((org) => requests.pipelines(org.pipelines_url, token)
                .selectMany(Rx.Observable.fromArray)
                .select((pipeline) => parsePipeline(org, pipeline))
            )
            .toArray()
            .select((items) => ({ items }))
        );
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
        .selectMany((key) => requests.builds(key.org, key.pipeline, token)
            .selectMany((builds) => Rx.Observable.fromArray(builds))
            .select((item) => parser.parseBuild(item, key)))
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

export default {
    getAll,
    getLatest
};
