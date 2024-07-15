import Rx from 'rx';
import requests from 'services/buildbot/buildbotRequests';
import { CIBuild, CIPipeline, CIServiceSettings } from 'services/service-types';

export default {
    getInfo: () => ({
        typeName: 'BuildBot',
        baseUrl: 'buildbot',
        icon: 'services/buildbot/icon.png',
        logo: 'services/buildbot/logo.png',
        fields: [
            { type: 'url', name: 'Server URL, e.g. https://build.webkit.org/' },
            { type: 'username' },
            { type: 'password' },
        ],
        defaultConfig: {
            baseUrl: 'buildbot',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
            updateInterval: 60,
        },
    }),
    getAll: settings =>
        requests
            .allBuilds(settings)
            .select(parseAvailableBuilds)
            .selectMany(projects => Rx.Observable.fromArray(projects)),
    getLatest: (settings: CIServiceSettings) =>
        Rx.Observable.fromArray(settings.projects).selectMany(id =>
            requests
                .lastBuild(id, settings)
                .zip(requests.lastCompletedBuild(id, settings), (lastBuild, lastCompletedBuild) =>
                    parseBuild(id, settings, lastBuild, lastCompletedBuild)
                )
                .catch(ex =>
                    Rx.Observable.return<CIBuild>({
                        id,
                        name: id,
                        group: null,
                        error: { name: 'Error', message: ex.message },
                    })
                )
        ),
};

function parseAvailableBuilds(apiJson: any): CIPipeline[] {
    return Object.keys(apiJson).map(id => ({
        id,
        name: id,
        group: apiJson[id].category,
        isDisabled: false,
    }));
}

const parseBuild = (id, settings, lastBuild, lastCompletedBuild): CIBuild => ({
    id,
    name: id,
    group: lastBuild.category,
    webUrl: new URL(`builders/${id}`, settings.url).href,
    isBroken: lastCompletedBuild.text.includes('failed'),
    isRunning: lastBuild.state === 'building',
    isDisabled: lastBuild.state === 'offline',
    changes: lastCompletedBuild.blame.map(item => ({ name: item })),
});
