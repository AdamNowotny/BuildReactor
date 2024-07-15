import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';

const allBuilds = (settings: CIServiceSettings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL('json/builders', settings.url).href,
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const lastBuild = (id: string, settings: CIServiceSettings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`json/builders/${id}`, settings.url).href,
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const lastCompletedBuild = (id: string, settings: CIServiceSettings) =>
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
