import logger from 'common/logger';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

const authType = settings => (settings.username ? 'httpAuth' : 'guestAuth');
const branchParam = settings => (settings.branch ? `,branch:(${settings.branch})` : '');

const requestBuildTypes = (settings: CIServiceSettings) =>
    request.get({
        url: new URL(`${authType(settings)}/app/rest/buildTypes`, settings.url).href,
        query: {
            fields: 'buildType(id,name,projectName,paused)',
        },
        type: 'json',
        username: settings.username,
        password: settings.password,
    });

const requestBuild = (id: string, settings: CIServiceSettings) =>
    request.get({
        url: new URL(`${authType(settings)}/app/rest/builds`, settings.url).href,
        query: {
            locator: `buildType:${id},running:any,count:1${branchParam(settings)}`,
            fields: 'build(running,status,webUrl,buildType(name,projectName),changes(change(comment,username,user(username))))',
        },
        type: 'json',
        username: settings.username,
        password: settings.password,
    });

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('teamcity.getPipelines', settings);
    const response = await requestBuildTypes(settings);
    const buildTypes: any = response.body.buildType;
    return buildTypes.map(parseAvailableBuilds);
};

const getLatestBuilds = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('teamcity.getLatestBuilds', settings);
    return Promise.all(
        settings.pipelines.map(async id => {
            try {
                const response = await requestBuild(id, settings);
                const [build] = response.body.build;
                if (!build) {
                    throw new Error(`No build for branch [${settings.branch}]`);
                }
                return parseBuild(id, build);
            } catch (ex: any) {
                return {
                    id: id,
                    name: id,
                    error: { name: 'Error', message: ex.message },
                };
            }
        }),
    );
};

export default {
    getDefinition: (): CIServiceDefinition => ({
        typeName: 'TeamCity',
        baseUrl: 'teamcity',
        icon: 'services/teamcity/icon.png',
        logo: 'services/teamcity/logo.png',
        fields: [
            { type: 'url', name: 'Server URL, e.g. http://teamcity.jetbrains.com/' },
            { type: 'username' },
            { type: 'password' },
            { type: 'branch' },
        ],
        defaultConfig: {
            baseUrl: 'teamcity',
            name: '',
            pipelines: [],
            url: '',
            username: '',
            password: '',
            branch: '',
        },
    }),
    getPipelines,
    getLatestBuilds,
};

const parseAvailableBuilds = (buildType: any): CIPipeline => ({
    id: buildType.id,
    name: buildType.name,
    group: buildType.projectName,
    isDisabled: buildType.paused,
});

const parseBuild = (id: string, build: any): CIBuild => ({
    id,
    name: build.buildType.name,
    group: build.buildType.projectName,
    webUrl: build.webUrl,
    isBroken: ['FAILURE', 'ERROR'].includes(build.status),
    isRunning: build.running,
    isWaiting: build.state === 'queued',
    changes:
        build.changes?.change?.map(change => ({
            name: change.username,
            message: change.comment?.split('\n')[0],
        })) || [],
});
