import logger from 'common/logger';
import { parseString } from 'xml2js';
import errors from './requestErrors';

interface RequestOptions {
    url: string;
    query?: Record<string, string | number | string[]>;
    body?: object | string;
    headers?: HeadersInit;
    username?: string;
    password?: string;
    type?: string;
    timeout?: number;
}

const get = async (options: RequestOptions) => {
    const url: URL = new URL(options.url);
    Object.entries(options.query ?? {}).forEach(([key, value]) => {
        url.searchParams.append(key, value as string);
    });
    const fetchOptions = createRequest(options);

    const response = await fetch(url, fetchOptions);
    logger.log('request.fetch', response);
    if (!response.ok) {
        logger.log('Request failed', errors.create(response, options.url));
        throw errors.create(response, options.url);
    }
    try {
        const data = options.type === 'xml' ? await parseXml(response) : await response.json();
        return {
            body: data,
            headers: response.headers,
        };
    } catch (ex: any) {
        throw new Error(`${ex.message} (${options.url})`);
    }
};

export default {
    get,
};

function createRequest(options: RequestOptions) {
    const fetchOptions = {
        method: 'GET',
        headers: options.headers ?? new Headers(),
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    };

    if (options.username) {
        fetchOptions.headers['Authorization'] =
            'Basic ' + btoa(`${options.username}:${options.password ?? ''}`);
    }
    if (options.type) {
        fetchOptions.headers['Content-Type'] = 'application/' + options.type;
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
