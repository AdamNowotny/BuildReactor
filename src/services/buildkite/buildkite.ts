import logger from 'common/logger';
import Rx from 'rx';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIBuildTag,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

const requestOrganizations = (settings: CIServiceSettings) =>
    request.get({
        url: 'https://api.buildkite.com/v2/organizations',
        query: { access_token: settings.token ?? '' },
    });

const requestPipelines = (url, settings: CIServiceSettings) =>
    request.get({
        url,
        query: { access_token: settings.token ?? '', per_page: 100 },
    });

const requestLatestBuild = (org, pipeline, settings) =>
    request.get({
        url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
        query: {
            access_token: settings.token,
            per_page: 1,
            branch: settings.branch || 'main',
        },
    });

const requestLatestFinishedBuild = (org, pipeline, settings) =>
    request.get({
        url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
        query: {
            access_token: settings.token,
            per_page: 1,
            branch: settings.branch || 'main',
            'state[]': ['failed', 'passed'],
        },
    });

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('buildkite.getPipelines', settings);
    const response = await requestOrganizations(settings);
    const orgs = response.body;
    const pipelineRequests = orgs.map(async org => {
        const pipelinesResponse = await requestPipelines(org.pipelines_url, settings);
        return pipelinesResponse.body.map(pipeline => parsePipeline(org, pipeline));
    });
    const pipelines = (await Promise.all(pipelineRequests)).flat();
    if (!pipelines.length) throw new Error('No pipelines found');
    return pipelines;
};

const parsePipeline = (org: any, pipeline: any): CIPipeline => ({
    id: `${org.slug}/${pipeline.slug}`,
    name: pipeline.name,
    group: org.name,
});

const getBuildStates = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('buildkite.getBuildStates', settings);
    return Promise.all(
        settings.projects.map(async id => {
            const key = createKey(id);
            try {
                const response = await requestLatestBuild(
                    key.org,
                    key.pipeline,
                    settings,
                );
                const [build] = response.body;
                let finishedBuild;
                if (
                    ['running', 'scheduled', 'canceled', 'canceling'].includes(
                        build.state,
                    )
                ) {
                    finishedBuild = await requestLatestFinishedBuild(
                        key.org,
                        key.pipeline,
                        settings,
                    );
                    finishedBuild = finishedBuild.body[0];
                }
                return parseBuild(build, key, finishedBuild);
            } catch (ex: any) {
                return {
                    id: key.id,
                    name: key.pipeline,
                    group: key.org,
                    error: { name: 'Error', message: ex.message },
                };
            }
        }),
    );
};

export default {
    getInfo: (): CIServiceDefinition => ({
        typeName: 'BuildKite',
        baseUrl: 'buildkite',
        icon: 'services/buildkite/icon.png',
        logo: 'services/buildkite/logo.svg',
        fields: [
            {
                type: 'token',
                help: 'Permissions needed: read_builds, read_organizations, read_pipelines',
            },
            { type: 'branch' },
        ],
        defaultConfig: {
            baseUrl: 'buildkite',
            name: '',
            projects: [],
            token: '',
            branch: 'main',
        },
    }),
    getAll: (settings: CIServiceSettings): Rx.Observable<CIPipeline> =>
        Rx.Observable.fromPromise(getPipelines(settings)).flatMap(pipelines =>
            Rx.Observable.fromArray(pipelines),
        ),
    getLatest: (settings: CIServiceSettings): Rx.Observable<CIBuild> =>
        Rx.Observable.fromPromise(getBuildStates(settings)).flatMap(buildStates =>
            Rx.Observable.fromArray(buildStates),
        ),
    getPipelines,
    getBuildStates,
};

const createKey = stringId => {
    const [org, pipeline] = stringId.split('/');
    return {
        id: stringId,
        org,
        pipeline,
    };
};

const parseBuild = (latestBuild, key, finishedBuild): CIBuild => {
    const org = key.org;
    const pipeline = key.pipeline;
    const primaryBuild = finishedBuild || latestBuild;
    return {
        changes: latestBuild.creator
            ? [
                  {
                      name: latestBuild.creator.name,
                      message: latestBuild.message,
                  },
              ]
            : [],
        group: org,
        id: `${org}/${pipeline}`,
        isBroken: primaryBuild.state === 'failed',
        isRunning: latestBuild.state === 'running',
        isWaiting: latestBuild.state === 'scheduled',
        name: pipeline,
        tags: createTags(latestBuild),
        webUrl: latestBuild.web_url,
    };
};

const createTags = build => {
    const tags: CIBuildTag[] = [];
    if (['canceled', 'canceling'].includes(build.state)) {
        tags.push({ name: 'Canceled', type: 'warning' });
    }
    if (build.state === 'not_run') {
        tags.push({ name: 'Not built', type: 'warning' });
    }
    return tags;
};
