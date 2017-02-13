import Rx from 'rx';
import parser from 'services/buildkite/parser';
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
            .select((latestBuild) => parser.parseBuild(latestBuild, key))
            .selectMany((build) => {
                if (build.isRunning || build.isWaiting) {
                    return requests.latestFinishedBuild(key.org, key.pipeline, token)
                        .select((finishedBuild) => parser.parseBuild(finishedBuild, key))
                        .select((finishedBuild) => {
                            build.isBroken = finishedBuild.isBroken;
                            return build;
                        });
                } else {
                    return Rx.Observable.return(build);
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

export default {
    getAll,
    getLatest
};
