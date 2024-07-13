import { joinUrl } from 'common/utils';
import request from 'service-worker/request';

const allBuilds = settings =>
    Rx.Observable.fromPromise(
        request.get({
            url: joinUrl(settings.url, 'json/builders'),
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const lastBuild = (id, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: joinUrl(settings.url, `json/builders/${id}`),
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const lastCompletedBuild = (id, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: joinUrl(settings.url, `json/builders/${id}/builds/-1`),
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
