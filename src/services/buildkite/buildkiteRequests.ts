import Rx from 'rx';
import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';

const organizations = (settings: CIServiceSettings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: 'https://api.buildkite.com/v2/organizations',
            query: { access_token: settings.token! },
        })
    )
        .select(response => response.body)
        .selectMany(Rx.Observable.fromArray);

const pipelines = (url, settings: CIServiceSettings) =>
    Rx.Observable.fromPromise(
        request.get({
            url,
            query: { access_token: settings.token!, per_page: 100 },
        })
    )
        .select(response => response.body)
        .selectMany(Rx.Observable.fromArray);

const latestBuild = (org, pipeline, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
            query: {
                access_token: settings.token,
                per_page: 1,
                branch: settings.branch || 'master',
            },
        })
    )
        .select(response => response.body)
        .selectMany(builds => Rx.Observable.fromArray(builds))
        .take(1);

const latestFinishedBuild = (org, pipeline, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
            query: {
                access_token: settings.token,
                per_page: 1,
                branch: settings.branch || 'master',
                'state[]': ['failed', 'passed'],
            },
        })
    )
        .select(response => response.body)
        .selectMany(Rx.Observable.fromArray)
        .take(1);

export default {
    organizations,
    pipelines,
    latestBuild,
    latestFinishedBuild,
};
