import request from 'service-worker/request';

const authType = settings => (settings.username ? 'httpAuth' : 'guestAuth');
const branchParam = settings => (settings.branch ? `,branch:(${settings.branch})` : '');

const buildTypes = settings =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`${authType(settings)}/app/rest/buildTypes`, settings.url).href,
            query: {
                fields: 'buildType(id,name,projectName)',
            },
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

const builds = (id, settings) =>
    Rx.Observable.fromPromise(
        request.get({
            url: new URL(`${authType(settings)}/app/rest/builds`, settings.url).href,
            query: {
                locator: `buildType:${id},running:any,count:1${branchParam(settings)}`,
                fields:
                    'build(running,status,webUrl,buildType(name,projectName),' +
                    'changes(change(comment,username,user(username))))',
            },
            type: 'json',
            username: settings.username,
            password: settings.password,
        })
    ).select(response => response.body);

export default {
    buildTypes,
    builds,
};
