import Rx from 'rx';
import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';

const repositories = (settings: CIServiceSettings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`/repos`, settings.apiUrl).href,
            headers: {
                'Travis-API-Version': '3',
                Authorization: `token ${settings.token}`,
            },
        })
    )
        .select(response => response.body.repositories)
        .selectMany(Rx.Observable.fromArray);

const builds = (id: string, settings: CIServiceSettings) =>
    Rx.Observable.fromPromise(
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
        })
    )
        .select(response => response.body.builds)
        .selectMany(buildList => Rx.Observable.fromArray(buildList))
        .take(1);

export default {
    repositories,
    builds,
};
