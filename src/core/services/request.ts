import 'rx/dist/rx.binding';
import Rx from 'rx';
import errors from 'core/services/requestErrors';
import { parseString } from 'xml2js';
import logger from 'common/logger';

interface RequestOptions {
    url: string
    query?: Record<string, string>
    body?: object | string
    headers?: HeadersInit
    username?: string
    password?: string
    type?: string
    timeout?: number
}

const fetchCallback = async (options: RequestOptions, callback) => {
    try {
        const url: URL = new URL(options.url);
        Object.entries(options.query ?? {})
            .forEach(([key, value]) => { url.searchParams.append(key, value); });
        const fetchOptions = createRequest(options);

        const response = await fetch(url, fetchOptions);
        logger.log('request.fetch', response);
        if (!response.ok) {
            callback(errors.create({ response }, options), null);
            return;
        }
        const data = options.type === 'xml' ?
            await parseXml(response) :
            await response.json();
        callback(null, {
            body: data,
            headers: response.headers,
        });
    } catch (error) {
        callback(errors.create(error, options), null);
    }
};

const get = (options) => Rx.Observable.fromNodeCallback(fetchCallback)(options);

export default {
    get
};

function createRequest(options: RequestOptions) {
    const fetchOptions: RequestInit = {
        method: 'GET',
        headers: options.headers ?? new Headers(),
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    };

    if (options.username) {
        fetchOptions.headers!['Authorization'] = 'Basic ' + btoa(`${options.username}:${options.password ?? ''}`);
    }
    if (options.type) {
        fetchOptions.headers!['Content-Type'] = 'application/' + options.type;
    }
    return fetchOptions;
}

async function parseXml(response: Response) {
    return response.text().then(text => {
        let result;
        parseString(text, (err, json) => {
            if (err) throw err;
            result = json;
        });
        return result;
    });
}
