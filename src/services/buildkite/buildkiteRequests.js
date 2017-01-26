import request from 'services/buildkite/jsonRequest';

const organizations = (token) => request
    .get({
        url: 'https://api.buildkite.com/v2/organizations',
        query: { access_token: token }
    })
    .select((response) => response.body);

const pipelines = (url, token) => request
    .get({
        url,
        query: { access_token: token, per_page: 100 }
    })
    .select((response) => response.body);

const builds = (org, pipeline, token) => request
    .get({
        url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
        query: { access_token: token, per_page: 1, branch: 'master' }
    })
    .select((response) => response.body);

export default {
    organizations,
    pipelines,
    builds
};
