import Rx from 'rx';
import joinUrl from 'common/joinUrl';
import request from 'services/jsonRequest';

export default {
    jobs: ({ url, settings }) => request
        .get({
            url: joinUrl(url, '/api/json?tree=' +
                'jobs[_class,name,url,buildable,inQueue,fullName,' +
                    'jobs[_class,name,url,buildable,inQueue,fullName,' +
                        'jobs[_class,name,url,buildable,inQueue,fullName]' +
                    ']' +
                ']'),
            username: settings.username,
            password: settings.password
        })
        .select((response) => response.body.jobs)
        .selectMany(Rx.Observable.fromArray),

    jobDetails: ({ id, settings }) => {
        const [folder, project, branch] = id.split('/');
        const jobUrl = (branch) ?
            joinUrl(settings.url, `/job/${folder}/job/${project}/job/${branch}`) :
            joinUrl(settings.url, `/job/${folder}/job/${project}`);
        return request.get({
            url: joinUrl(jobUrl, '/api/json?tree=' +
                'buildable,inQueue,' +
                'lastBuild[url,building,number,changeSets[items[author[fullName],msg]]],' +
                'lastCompletedBuild[result]'),
            username: settings.username,
            password: settings.password
        })
        .select((response) => response.body);
    }
};
