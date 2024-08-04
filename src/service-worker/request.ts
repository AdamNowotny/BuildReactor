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

interface RequestResponse {
    body: any;
    headers: Headers;
}

const get = async (options: RequestOptions): Promise<RequestResponse> => {
    const url: URL = new URL(options.url);
    Object.entries(options.query ?? {}).forEach(([key, value]) => {
        url.searchParams.append(key, value as string);
    });
    const fetchOptions = createRequest(options);

    const response = await fetch(url, fetchOptions);
    logger.log('request.fetch', fetchOptions, response);
    if (!response.ok) {
        logger.info('Request failed', errors.create(response, options.url));
        throw errors.create(response, options.url);
    }
    try {
        const data =
            options.type === 'xml' ? await parseXml(response) : await response.json();
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
    const headers = new Headers(options.headers);
    if (options.username) {
        headers.set(
            'Authorization',
            'Basic ' + btoa(`${options.username}:${options.password ?? ''}`),
        );
    }
    if (options.type) {
        headers.set('Content-Type', `application/${options.type}`);
        headers.set('Accept', `application/${options.type}`);
    }
    return {
        method: 'GET',
        headers,
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    };
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
