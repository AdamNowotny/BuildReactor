import Rx from 'rx';
import requests from 'services/cctray/cctrayRequests';

export default {
    getInfo: () => ({
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
            updateInterval: 60
        },
        fields: [
            {
                type: 'url',
                name: 'Server URL (cctray XML)',
                help: 'Example: http://server.com/cc.xml'
            },
            { type: 'username' },
            { type: 'password' }
        ]
    }),
    getAll: (settings) => requests.projects(settings)
        .select((body) => body.Projects.Project)
        .selectMany((projects) => Rx.Observable.fromArray(projects)
            .select((project) => ({
                id: project.$.name,
                name: project.$.name,
                group: project.$.category || null,
                isDisabled: false
            }))
            .select(categoriseFromName)
        ),
    getLatest: (settings) => requests.projects(settings)
        .selectMany((body) => Rx.Observable.fromArray(body.Projects.Project))
        .select((project) => {
            const status = project.$.lastBuildStatus;
            const state = {
                id: project.$.name,
                name: project.$.name,
                group: project.$.category || null,
                webUrl: project.$.webUrl || null,
                isRunning: project.$.activity === 'Building',
                isWaiting: status === 'Pending',
                isBroken: false,
                isDisabled: false,
                tags: [],
                changes: createChanges(project)
            };
            if (status in { 'Success': 1, 'Failure': 1, 'Exception': 1 }) {
                state.isBroken = status in { 'Failure': 1, 'Exception': 1 };
            } else if (status !== 'Unknown') {
                state.tags.push({
                    name: 'Unknown',
                    description: `Status [${status}] not supported` });
            }
            return state;
        })
        .select(categoriseFromName)
};

const createChanges = (project) => {
    const breakers = (project.messages && project.messages.length && typeof project.messages[0] === 'object') ?
        project.messages[0].message
            .filter((message) => message.$.kind === 'Breakers')
            .map((message) => message.$.text)[0] :
        null;
    return breakers ?
        breakers.split(', ').map((username) => ({ name: username })) :
        [];
};

var categoriseFromName = function(d) {
    if (!d.group && d.name && d.name.split(' :: ').length > 1) {
        var nameParts = d.name.split(' :: ');
        d.group = nameParts[0];
        d.name = nameParts.slice(1).join(' :: ');
    }
    return d;
};
