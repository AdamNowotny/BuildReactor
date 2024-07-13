import Rx from 'rx';
import request from 'service-worker/request';

const projects = settings =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL('rest/api/latest/project', settings.url).href,
            query: {
                expand: 'projects.project.plans.plan',
                'max-result': 1000,
                os_authType: settings.username ? 'basic' : 'guest',
            },
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    )
        .select(response => response.body.projects.project)
        .selectMany(Rx.Observable.fromArray);

const plan = (id, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`rest/api/latest/plan/${id}`, settings.url).href,
            query: {
                os_authType: settings.username ? 'basic' : 'guest',
            },
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const result = (id, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`rest/api/latest/result/${id}/latest`, settings.url).href,
            query: {
                expand: 'changes.change',
                os_authType: settings.username ? 'basic' : 'guest',
            },
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

export default {
    projects,
    plan,
    result,
};
