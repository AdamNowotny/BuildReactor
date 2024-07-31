import logger from 'common/logger';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

const requestProjects = (settings: CIServiceSettings): Promise<any> => {
    return request.get({
        url: new URL('rest/api/latest/project.json', settings.url).href,
        query: {
            expand: 'projects.project.plans.plan',
            'max-result': 1000,
            os_authType: settings.token ? 'basic' : 'guest',
        },
        type: 'json',
        headers: settings.token
            ? {
                  Authorization: `Bearer ${settings.token}`,
              }
            : undefined,
    });
};

const requestResult = (id: string, settings: CIServiceSettings) =>
    request.get({
        url: new URL(`rest/api/latest/result/${id}/latest.json`, settings.url).href,
        query: {
            expand: 'plan,vcsRevisions.vcsRevision.changes.change',
            max_result: 1,
            os_authType: settings.token ? 'basic' : 'guest',
        },
        type: 'json',
        headers: settings.token
            ? {
                  Authorization: `Bearer ${settings.token}`,
              }
            : undefined,
    });

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    const response = await requestProjects(settings);
    logger.log('bamboo.getPipelines', response);
    const projects = response.body.projects.project;
    return projects.flatMap(project => project.plans.plan.map(createPipeline));
};

const getLatestBuilds = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('bamboo.getLatestBuilds', settings);
    return Promise.all(
        settings.pipelines.flatMap(async key => {
            try {
                const resultResponse = await requestResult(key, settings);
                return parseBuild(key, settings, resultResponse.body);
            } catch (ex: any) {
                return {
                    id: key,
                    name: key,
                    error: { name: 'Error', message: ex.message },
                };
            }
        }),
    );
};

export default {
    getDefinition: (): CIServiceDefinition => ({
        typeName: 'Atlassian Bamboo',
        baseUrl: 'bamboo',
        icon: 'services/bamboo/icon.png',
        logo: 'services/bamboo/logo.png',
        fields: [
            {
                type: 'url',
                name: 'Server URL, e.g. http://ci.openmrs.org/',
                help: 'For Bamboo OnDemand use https://[your_account].atlassian.net/builds',
            },
            { type: 'token' },
        ],
        defaultConfig: {
            baseUrl: 'bamboo',
            name: '',
            pipelines: [],
            url: '',
            token: '',
        },
    }),
    getPipelines,
    getLatestBuilds,
};

const parseBuild = (id, settings, resultResponse) => {
    const state: CIBuild = {
        changes: resultResponse.vcsRevisions.vcsRevision.flatMap(vcsRevision =>
            vcsRevision.changes.change.map(change => ({
                name: change.fullName ?? change.author,
                message: change.comment,
            })),
        ),
        group: resultResponse.plan.projectName,
        id,
        isBroken: resultResponse.state === 'Failed',
        isDisabled: !resultResponse.plan.enabled,
        isRunning: resultResponse.plan.isBuilding,
        isWaiting: resultResponse.plan.isActive,
        name: resultResponse.plan.shortName,
        webUrl: new URL(`browse/${resultResponse.key}`, settings.url).href,
    };
    if (!(resultResponse.state in { Successful: 1, Failed: 1 })) {
        state.tags?.push({
            name: 'Unknown',
            description: `State [${resultResponse.state}] not supported`,
        });
        delete state.isBroken;
    }
    return state;
};

const createPipeline = (plan: any): CIPipeline => ({
    id: plan.key,
    name: plan.shortName,
    group: plan.projectName,
    isDisabled: !plan.enabled,
});
