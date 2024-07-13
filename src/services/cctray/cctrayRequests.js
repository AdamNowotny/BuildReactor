import request from 'service-worker/request';

export default {
    projects: settings =>
        Rx.Observable.fromPromise(
            request.get({
                url: settings.url,
                type: 'xml',
                username: settings.username,
                password: settings.password,
            })
        ).select(response => response.body),
};
