import joinUrl from 'common/joinUrl';
import request from 'services/jsonRequest';

const authType = (settings) => (settings.username ? 'httpAuth' : 'guestAuth');
const branchParam = (settings) => (settings.branch ? `,branch:(${settings.branch})` : '');

const buildTypes = (settings) => request
    .get({
        url: joinUrl(settings.url, `${authType(settings)}/app/rest/buildTypes`),
        query: {
            fields: 'buildType(id,name,projectName)'
        },
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);


const builds = (id, settings) => request
    .get({
        url: joinUrl(settings.url, `${authType(settings)}/app/rest/builds`),
        query: {
            locator: `buildType:${id},running:any,count:1${branchParam(settings)}`,
            fields: 'build(running,status,webUrl,buildType(name,projectName),' +
                'changes(change(comment,username,user(username))))'
        },
        type: 'json',
        username: settings.username,
        password: settings.password
    })
    .select((response) => response.body);

export default {
    buildTypes,
    builds
};
