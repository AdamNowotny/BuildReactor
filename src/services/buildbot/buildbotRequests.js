import joinUrl from 'common/joinUrl';
import request from 'services/jsonRequest';

const allBuilds = (settings) => request
    .get({
        url: joinUrl(settings.url, 'json/builders'),
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);

const lastBuild = (id, settings) => request
    .get({
        url: joinUrl(settings.url, `json/builders/${id}`),
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);

const lastCompletedBuild = (id, settings) => request
    .get({
        url: joinUrl(settings.url, `json/builders/${id}/builds/-1`),
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);

export default {
    allBuilds,
    lastBuild,
    lastCompletedBuild
};
