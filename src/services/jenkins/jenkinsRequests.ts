import Rx from 'rx';
import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';

export default {
    jobs: ({ url, settings }: { url: string; settings: CIServiceSettings }): Rx.Observable<any> =>
        Rx.Observable.fromPromise(
            request.get({
                url: new URL(
                    '/api/json?tree=' +
                        'jobs[_class,name,url,buildable,fullName,' +
                        'jobs[_class,name,url,buildable,fullName,' +
                        'jobs[_class,name,url,buildable,fullName]' +
                        ']' +
                        ']',
                    url
                ).href,
                username: settings.username,
                password: settings.password,
            })
        )
            .select(response => response.body.jobs)
            .selectMany(Rx.Observable.fromArray),

    jobDetails: ({ id, settings }) => {
        const jobPath = `/job/${id.split('/').join('/job/')}`;
        const jobUrl = new URL(jobPath, settings.url).href;
        return Rx.Observable.fromPromise(
            request.get({
                url:
                    `${jobUrl}/api/json?tree=` +
                    'buildable,inQueue,' +
                    'lastBuild[url,building,number,' +
                    'changeSets[items[author[fullName],msg]],' +
                    'changeSet[items[author[fullName],msg]]' +
                    '],' +
                    'lastCompletedBuild[result]',
                username: settings.username,
                password: settings.password,
            })
        ).select(response => response.body);
    },
};
