import 'rx/dist/rx.binding';
import Rx from 'rx';
import errors from 'services/errors';
import superagent from 'superagent';

const requestCallback = (options, callback) => {
    let request = superagent.get(options.url);
    if (options.username) {
        request = request.auth(options.username, options.password);
    }
    if (options.headers) {
        request = request.set(options.headers);
    }
    request
        .query(options.query)
        .timeout(options.timeout || 60000)
        .end((err, response) => {
            callback(err, response);
        });
};

const get = (options) => Rx.Observable.fromNodeCallback(requestCallback)(options)
    .catch((ex) => Rx.Observable.throw(errors.create(ex, options)))
    .select((response) => ({
        body: response.body,
        headers: response.headers
    }));

export default {
    get
};
