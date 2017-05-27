import Rx from 'rx';
import joinUrl from 'common/joinUrl';
import request from 'services/jsonRequest';

const repositories = (settings) => request
    .get({
        url: joinUrl(settings.apiUrl, `/repos`),
        headers: {
            'Travis-API-Version': 3,
            'Authorization': `token ${settings.token}`
        }
    })
    .select((response) => response.body.repositories)
    .selectMany(Rx.Observable.fromArray);

const builds = (id, settings) => request
    .get({
        url: joinUrl(settings.apiUrl, `/repo/${encodeURIComponent(id)}/builds`),
        query: {
            limit: 1,
            include: 'build.commit'
        },
        headers: {
            'Travis-API-Version': 3,
            'Authorization': `token ${settings.token}`
        }
    })
    .select((response) => response.body.builds)
    .selectMany((buildList) => Rx.Observable.fromArray(buildList))
    .take(1);

export default {
    repositories,
    builds
};
