import logger from 'common/logger';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIBuildChange,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'common/types';

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('cctray.getPipelines', settings);
    const response = await requestProjects(settings);
    // prettier-ignore
    return response.Project
        .map(project => parsePipeline(project))
        .map(categoriseFromName);
};

const getLatestBuilds = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('cctray.getLatestBuilds', settings);
    const response = await requestProjects(settings);
    const parsed = response.Project.map(project => parseBuildState(project))
        .filter(project => settings.pipelines.includes(project.id))
        .map(categoriseFromName);
    return Promise.all(parsed);
};

export default {
    getDefinition: (): CIServiceDefinition => ({
        typeName: 'CCTray XML',
        baseUrl: 'cctray',
        icon: 'cctray.png',
        logo: 'cctray.png',
        defaultConfig: {
            baseUrl: 'cctray',
            name: '',
            pipelines: [],
            url: '',
            username: '',
            password: '',
        },
        fields: [
            {
                type: 'url',
                name: 'Server URL (cctray XML)',
                help: 'More information at <a href="https://cctray.org/servers/" target="_blank">https://cctray.org/servers/</a>',
            },
            { type: 'username' },
            { type: 'password' },
        ],
    }),
    getPipelines,
    getLatestBuilds,
};

const requestProjects = async (settings: CIServiceSettings) => {
    const projects = await request.get({
        url: settings.url ?? '',
        type: 'xml',
        username: settings.username,
        password: settings.password,
    });
    return projects.body.Projects;
};

const categoriseFromName = function (d: CIPipeline) {
    const SEPARATOR = ' :: ';
    if (!d.group && d.name && d.name.split(SEPARATOR).length > 1) {
        const nameParts = d.name.split(SEPARATOR);
        d.group = nameParts[0];
        d.name = nameParts.slice(1).join(SEPARATOR);
    }
    return d;
};

function parseBuildState(project: any): CIBuild {
    const status = project.$.lastBuildStatus;
    const state: CIBuild = {
        changes: createChanges(project),
        group: project.$.category || null,
        id: project.$.name,
        isBroken: false,
        isDisabled: false,
        isRunning: project.$.activity === 'Building',
        isWaiting: status === 'Pending',
        name: project.$.name,
        tags: [],
        webUrl: project.$.webUrl || null,
    };
    if (status in { Success: 1, Failure: 1, Exception: 1, Pending: 1 }) {
        state.isBroken = status in { Failure: 1, Exception: 1 };
    } else if (status !== 'Unknown') {
        state.tags?.push({
            name: 'Unknown',
            description: `Status [${status}] not supported`,
        });
    }
    return state;
}

const createChanges = (project): CIBuildChange[] => {
    const breakers: CIBuildChange[] =
        project.messages
            ?.at(0)
            .message.filter(message => message.$.kind === 'Breakers')
            .map(message => message.$.text)
            .filter(message => message.length)
            .flatMap((username: string) =>
                username.split(',').map(username => ({
                    name: username.trim(),
                })),
            ) || [];
    return breakers;
};

function parsePipeline(project: any): CIPipeline {
    return {
        id: project.$.name,
        name: project.$.name,
        group: project.$.category || null,
        isDisabled: false,
    };
}
