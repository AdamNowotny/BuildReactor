import Rx from 'rx';
import requests from 'services/cctray/cctrayRequests';
import type {
    CIBuild,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

export default {
    getInfo: (): CIServiceDefinition => ({
        typeName: 'CCTray XML',
        baseUrl: 'cctray',
        icon: 'services/cctray/icon.png',
        logo: 'services/cctray/logo.png',
        defaultConfig: {
            baseUrl: 'cctray',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
        },
        fields: [
            {
                type: 'url',
                name: 'Server URL (cctray XML)',
                help: 'More information at https://cctray.org/servers/',
            },
            { type: 'username' },
            { type: 'password' },
        ],
    }),
    getAll: (settings: CIServiceSettings): Rx.Observable<CIPipeline> =>
        requests
            .projects(settings)
            .select(body => body.Projects.Project)
            .selectMany(projects =>
                Rx.Observable.fromArray(projects)
                    .select((project: any) => ({
                        id: project.$.name,
                        name: project.$.name,
                        group: project.$.category || null,
                        isDisabled: false,
                    }))
                    .select(categoriseFromName)
            ),
    getLatest: (settings: CIServiceSettings): Rx.Observable<CIBuild> =>
        requests
            .projects(settings)
            .selectMany(body => Rx.Observable.fromArray(body.Projects.Project))
            .select((project: any) => {
                const status = project.$.lastBuildStatus;
                const state: CIBuild = {
                    id: project.$.name,
                    name: project.$.name,
                    group: project.$.category || null,
                    webUrl: project.$.webUrl || null,
                    isRunning: project.$.activity === 'Building',
                    isWaiting: status === 'Pending',
                    isBroken: false,
                    isDisabled: false,
                    tags: [],
                    changes: createChanges(project),
                };
                if (status in { Success: 1, Failure: 1, Exception: 1 }) {
                    state.isBroken = status in { Failure: 1, Exception: 1 };
                } else if (status !== 'Unknown') {
                    state.tags?.push({
                        name: 'Unknown',
                        description: `Status [${status}] not supported`,
                    });
                }
                return state;
            })
            .select(categoriseFromName),
};

const createChanges = project => {
    const breakers =
        project.messages?.length && typeof project.messages[0] === 'object'
            ? project.messages[0].message
                  .filter(message => message.$.kind === 'Breakers')
                  .map(message => message.$.text)[0]
            : null;
    return breakers ? breakers.split(', ').map(username => ({ name: username })) : [];
};

const categoriseFromName = function (d) {
    if (!d.group && d.name && d.name.split(' :: ').length > 1) {
        const nameParts = d.name.split(' :: ');
        d.group = nameParts[0];
        d.name = nameParts.slice(1).join(' :: ');
    }
    return d;
};
