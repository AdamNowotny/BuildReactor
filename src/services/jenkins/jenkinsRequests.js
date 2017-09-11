import Rx from 'rx';
import joinUrl from 'common/joinUrl';
import request from 'core/services/request';

export default {
    jobs: ({ url, settings }) => request
        .get({
            url: joinUrl(url, '/api/json?tree=' +
                'jobs[_class,name,url,buildable,fullName,' +
                    'jobs[_class,name,url,buildable,fullName,' +
                        'jobs[_class,name,url,buildable,fullName]' +
                    ']' +
                ']'),
            username: settings.username,
            password: settings.password
        })
        .select((response) => response.body.jobs)
        .selectMany(Rx.Observable.fromArray),

    jobDetails: ({ id, settings }) => {
        const jobPath = `/job/${id.split('/').join('/job/')}`;
        const jobUrl = joinUrl(settings.url, jobPath);
        return request.get({
            url: `${jobUrl}/api/json?tree=` +
                'buildable,inQueue,' +
                'lastBuild[url,building,number,' +
                    'changeSets[items[author[fullName],msg]],' +
                    'changeSet[items[author[fullName],msg]]' +
                '],' +
                'lastCompletedBuild[result]',
            username: settings.username,
            password: settings.password
        })
        .select((response) => response.body);
    }
};
