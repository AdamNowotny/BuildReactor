import Rx from 'rx';
import request from 'services/jsonRequest';

const organizations = (token) => request
    .get({
        url: 'https://api.buildkite.com/v2/organizations',
        query: { access_token: token }
    })
    .select((response) => response.body)
    .selectMany(Rx.Observable.fromArray);

const pipelines = (url, token) => request
    .get({
        url,
        query: { access_token: token, per_page: 100 }
    })
    .select((response) => response.body)
    .selectMany(Rx.Observable.fromArray);

const latestBuild = (org, pipeline, token) => request
    .get({
        url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
        query: { access_token: token, per_page: 1, branch: 'master' }
    })
    .select((response) => response.body)
    .selectMany((builds) => Rx.Observable.fromArray(builds))
    .take(1);

const latestFinishedBuild = (org, pipeline, token) => request
    .get({
        url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
        query: {
            access_token: token,
            per_page: 1,
            branch: 'master',
            'state[]': ['failed', 'passed']
        }
    })
    .select((response) => response.body)
    .selectMany(Rx.Observable.fromArray)
    .take(1);

export default {
    organizations,
    pipelines,
    latestBuild,
    latestFinishedBuild
};
