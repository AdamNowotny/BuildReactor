import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';

export default {
    projects: (settings: CIServiceSettings) =>
        Rx.Observable.fromPromise(
            request.get({
                url: settings.url!,
                type: 'xml',
                username: settings.username,
                password: settings.password,
            })
        ).select(response => response.body),
};
