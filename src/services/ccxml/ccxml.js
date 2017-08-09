import Rx from 'rx';
import requests from 'services/ccxml/ccxmlRequests';

export default {
    getInfo: () => ({
        typeName: 'CCTray XML',
        baseUrl: 'ccxml',
        icon: 'services/ccxml/icon.png',
        logo: 'services/ccxml/logo.png',
        fields: [
            {
                type: 'url',
                name: 'Server URL (cctray XML)',
                help: 'Example: http://server.com/cc.xml'
            },
            { type: 'username' },
            { type: 'password' }
        ],
        defaultConfig: {
            baseUrl: 'ccxml',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
            updateInterval: 60
        }
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
            const breakers = project.messages ? project.messages.message
                .filter((message) => message.$.kind === 'Breakers')
                .map((message) => message.$.text)[0] : null;
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
                changes: breakers ?
                    breakers.split(', ').map((username) => ({ name: username })) :
                    []
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

var categoriseFromName = function(d) {
    if (!d.group && d.name && d.name.split(' :: ').length > 1) {
        var nameParts = d.name.split(' :: ');
        d.group = nameParts[0];
        d.name = nameParts.slice(1).join(' :: ');
    }
    return d;
};
