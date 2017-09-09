import 'rx/dist/rx.binding';
import Rx from 'rx';
import errors from 'services/requestErrors';
import { parseString } from 'xml2js';
import superagent from 'superagent';

const requestCallback = (options, callback) => {
    let request = superagent.get(options.url);
    if (options.username) {
        request = request.auth(options.username, options.password);
    }
    if (options.headers) {
        request = request.set(options.headers);
    }
    if (options.type) {
        request = request.accept(options.type);
        if (options.type === 'xml') {
            request = request.parse((response) => {
                let result;
                parseString(response.text, (err, json) => {
                    if (err) throw err;
                    result = json;
                });
                return result;
            });
        }
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
