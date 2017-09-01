import Rx from 'rx';
import joinUrl from 'common/joinUrl';
import requests from 'services/buildbot/buildbotRequests';

export default {
    getInfo: () => ({
        typeName: 'BuildBot',
        baseUrl: 'buildbot',
        icon: 'core/services/buildbot/icon.png',
        logo: 'core/services/buildbot/logo.png',
        fields: [
            { type: 'url', name: 'Server URL, e.g. https://build.webkit.org/' },
            { type: 'username' },
            { type: 'password' }
        ],
        defaultConfig: {
            baseUrl: 'buildbot',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
            updateInterval: 60
        }
    }),
    getAll: (settings) => requests.allBuilds(settings)
        .select(parseAvailableBuilds)
        .selectMany((projects) => Rx.Observable.fromArray(projects)),
    getLatest: (settings) => Rx.Observable.fromArray(settings.projects)
        .selectMany((id) => requests.lastBuild(id, settings)
            .zip(requests.lastCompletedBuild(id, settings), (lastBuild, lastCompletedBuild) =>
                parseBuild(id, settings, lastBuild, lastCompletedBuild)
            )
            .catch((ex) => Rx.Observable.return(({
                id,
                name: id,
                group: null,
                error: ex
            })))
        )
};

function parseAvailableBuilds(apiJson) {
    return Object.keys(apiJson)
        .map((id) => ({
            id,
            name: id,
            group: apiJson[id].category,
            isDisabled: false
        }));
}

const parseBuild = (id, settings, lastBuild, lastCompletedBuild) => ({
    id,
    name: id,
    group: lastBuild.category,
    webUrl: joinUrl(settings.url, `builders/${id}`),
    isBroken: lastCompletedBuild.text.includes('failed'),
    isRunning: lastBuild.state === "building",
    isDisabled: lastBuild.state === "offline",
    changes: lastCompletedBuild.blame.map((item) => ({ name: item }))
});
