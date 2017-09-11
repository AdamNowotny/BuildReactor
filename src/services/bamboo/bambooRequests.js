import Rx from 'rx';
import joinUrl from 'common/joinUrl';
import request from 'core/services/request';

const projects = (settings) => request
    .get({
        url: joinUrl(settings.url, 'rest/api/latest/project'),
        query: {
            expand: 'projects.project.plans.plan',
            'max-result': 1000,
            os_authType: settings.username ? 'basic' : 'guest'
        },
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body.projects.project)
    .selectMany(Rx.Observable.fromArray);

const plan = (id, settings) => request
    .get({
        url: joinUrl(settings.url, `rest/api/latest/plan/${id}`),
        query: {
            os_authType: settings.username ? 'basic' : 'guest'
        },
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);

const result = (id, settings) => request
    .get({
        url: joinUrl(settings.url, `rest/api/latest/result/${id}/latest`),
        query: {
            expand: 'changes.change',
            os_authType: settings.username ? 'basic' : 'guest'
        },
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);

export default {
    projects,
    plan,
    result
};
