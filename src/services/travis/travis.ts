import logger from 'common/logger';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIBuildChange,
    CIBuildTag,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

const requestRepositories = (settings: CIServiceSettings) =>
    request.get({
        url: new URL(`/repos`, settings.apiUrl).href,
        headers: {
            'Travis-API-Version': '3',
            Authorization: `token ${settings.token}`,
        },
    });

const requestBuilds = (id: string, settings: CIServiceSettings) =>
    request.get({
        url: new URL(`/repo/${encodeURIComponent(id)}/builds`, settings.apiUrl).href,
        query: {
            limit: 1,
            include: 'build.commit',
            'build.event_type': 'push',
        },
        headers: {
            'Travis-API-Version': '3',
            Authorization: `token ${settings.token}`,
        },
    });

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('travis.getPipelines', settings);
    const response = await requestRepositories(settings);
    const repositories: any = response.body.repositories ?? [];
    return repositories.filter(repo => repo.active).map(parsePipeline);
};

const getBuildStates = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('travis.getBuildStates', settings);
    return Promise.all(
        settings.projects.map(async projectId => {
            const key = createKey(projectId);
            try {
                const response = await requestBuilds(key.id, settings);
                const [build] = response.body.builds;
                return parseBuild(key, settings, build);
            } catch (ex: any) {
                return {
                    id: key.id,
                    name: key.repo,
                    group: key.org,
                    error: { name: 'Error', message: ex.message },
                };
            }
        }),
    );
};

export default {
    getInfo: (): CIServiceDefinition => ({
        typeName: 'Travis',
        baseUrl: 'travis',
        icon: 'services/travis/icon.png',
        logo: 'services/travis/logo.png',
        fields: [
            {
                type: 'url',
                name: 'API URL',
                config: 'apiUrl',
                help: 'Public: https://api.travis-ci.org, Private: https://api.travis-ci.com or custom url',
            },
            {
                type: 'url',
                name: 'Web URL',
                config: 'webUrl',
                help: 'Public: https://travis-ci.org, Private: https://travis-ci.com or custom url',
            },
            {
                type: 'token',
                help: 'Copy token from <a href="https://travis-ci.org/account/preferences" target="_blank">https://travis-ci.org/account/preferences</a>',
            },
        ],
        defaultConfig: {
            baseUrl: 'travis',
            name: '',
            apiUrl: 'https://api.travis-ci.org/',
            webUrl: 'https://travis-ci.org/',
            projects: [],
            token: '',
        },
    }),
    getPipelines,
    getBuildStates,
};

const parsePipeline = (repo: any) =>
    ({
        id: repo.slug,
        name: repo.name,
        group: repo.slug.split('/')[0],
        isDisabled: false,
    } as CIPipeline);

const parseBuild = (key: any, settings: CIServiceSettings, build: any) =>
    ({
        id: key.id,
        name: key.repo,
        group: key.org,
        webUrl: new URL(`${key.id}/builds/${build.id}`, settings.webUrl).href,
        isBroken: BUILD_STATES.BROKEN_KNOWN.includes(build.state)
            ? BUILD_STATES.BROKEN.includes(build.state)
            : BUILD_STATES.BROKEN.includes(build.previous_state),
        isRunning: build.state === 'started',
        isWaiting: build.state === 'created',
        tags: createTags(build),
        changes: createChanges(build),
    } as CIBuild);

const BUILD_STATES = {
    SUPPORTED: ['created', 'started', 'passed', 'failed', 'errored', 'canceled'],
    BROKEN_KNOWN: ['passed', 'failed', 'errored'],
    BROKEN: ['failed', 'errored'],
    CANCELED: ['canceled'],
};

const createKey = stringId => {
    const [org, repo] = stringId.split('/');
    return {
        id: stringId,
        org,
        repo,
    };
};

const createTags = (build): CIBuildTag[] => {
    const tags: CIBuildTag[] = [];
    if (['errored'].includes(build.state)) {
        tags.push({ name: 'Errored', type: 'warning' });
    }
    if (!BUILD_STATES.SUPPORTED.includes(build.state)) {
        tags.push({
            name: 'Unknown',
            type: 'warning',
            description: `Result [${build.state}] is unknown`,
        });
    }
    if (BUILD_STATES.CANCELED.includes(build.state)) {
        tags.push({
            name: 'Canceled',
            type: 'warning',
            description: `Build was canceled`,
        });
    }
    return tags;
};

const createChanges = (build): CIBuildChange[] => {
    if (!build.commit?.author) {
        return [];
    }
    return [
        {
            name: build.commit.author.name,
            message: build.commit.message,
        },
    ];
};
