import 'rx/dist/rx.binding';
import Rx from 'rx';
import errors from 'core/services/requestErrors';
import { parseString } from 'xml2js';

const fetchCallback = (options, callback) => {
    // Construct the URL with query parameters
    const url: URL = new URL(options.url);
    if (options.query) {
        Object.keys(options.query).forEach(key => url.searchParams.append(key, options.query[key]));
    }

    // Set up fetch options
    const fetchOptions = {
        method: 'GET',
        headers: options.headers || {}
    };

    // Handle basic authentication
    if (options.username) {
        fetchOptions.headers['Authorization'] = 'Basic ' + btoa(`${options.username}:${options.password}`);
    }

    // Execute the fetch request
    fetch(url, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            // Parse the response based on the expected type
            if (options.type === 'xml') {
                return response.text().then(text => {
                    let result;
                    parseString(text, (err, json) => {
                        if (err) throw err;
                        result = json;
                    });
                    return result;
                });
            } else {
                return response.json();
            }
        })
        .then(data => {
            callback(null, {
                body: data,
                headers: {}, // Fetch does not expose headers directly; handle as needed
            });
        })
        .catch(err => {
            callback(err, null);
        });
};

const get = (options) => Rx.Observable.fromNodeCallback(fetchCallback)(options)
    .catch((ex) => Rx.Observable.throw(errors.create(ex, options)))
    .select((response) => ({
        body: response.body,
        headers: response.headers
    }));

export default {
    get
};
