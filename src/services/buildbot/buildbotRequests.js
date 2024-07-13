import request from 'service-worker/request';

const allBuilds = settings =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL('json/builders', settings.url).href,
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const lastBuild = (id, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`json/builders/${id}`, settings.url).href,
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const lastCompletedBuild = (id, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`json/builders/${id}/builds/-1`, settings.url).href,
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

export default {
    allBuilds,
    lastBuild,
    lastCompletedBuild,
};
