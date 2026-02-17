import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import request from './request';
import errors from './requestErrors';

vi.mock('common/logger');
vi.mock('./requestErrors');

const headersGet = vi.fn();
const headersSet = vi.fn();

// Create a proper class mock for Headers that works with vitest 4.x
class MockHeaders {
    get = headersGet;
    set = headersSet;
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_init?: HeadersInit) {
        // Constructor required for Headers interface compatibility
    }
}

global.fetch = vi.fn();
vi.stubGlobal('Headers', MockHeaders);

beforeEach(() => {
    headersGet.mockReset();
    headersSet.mockReset();
});

const setupResponse = (response: any) => {
    (global.fetch as Mock).mockResolvedValue({
        json: () =>
            new Promise(resolve => {
                resolve(response);
            }),
        text: () =>
            new Promise(resolve => {
                resolve(response);
            }),
        ok: true,
        headers: new Headers(),
    });
};

const setupErrorResponse = (response: any) => {
    (global.fetch as Mock).mockResolvedValue({
        json: () => Promise.reject(new Error(response)),
        ok: false,
        headers: [],
        status: response.status,
    });
};

it('should return response', async () => {
    setupResponse([{ name: 'org1' }]);

    const result = await request.get({
        url: 'https://sample.com/',
        query: {
            token: 'token',
        },
    });

    expect(result).toEqual({
        body: [{ name: 'org1' }],
        headers: expect.any(Object),
        links: undefined,
    });
    expect(global.fetch).toBeCalledWith(
        new URL('https://sample.com/?token=token'),
        expect.anything(),
    );
});

it('should return error on exception', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('error message'));

    const result = request.get({
        url: 'https://sample.com/',
        query: {
            token: 'token',
        },
    });

    await expect(result).rejects.toThrow('error message');
});

it('should raise error when request failed', async () => {
    setupErrorResponse({ status: 500 });
    const error: Error = {
        name: 'Error',
        message: 'error message',
    };
    (errors.create as Mock).mockReturnValue(error);

    const result = request.get({
        url: 'https://sample.com/',
        query: {
            token: 'token',
        },
    });

    await expect(result).rejects.toThrow(error.message);
});

it('should set timeout if specified', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        timeout: 10000,
    });

    expect(global.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            signal: expect.any(AbortSignal),
        }),
    );
});

it('should set auth if username specified', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        username: 'user',
        password: 'pass',
    });

    expect(headersSet).toBeCalledWith('Authorization', expect.stringContaining('Basic '));
    expect(global.fetch).toBeCalled();
});

it('should not set auth if username not specified', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        username: undefined,
        password: 'pass',
    });

    expect(headersSet).not.toBeCalledWith(
        'Authorization',
        expect.stringContaining('Basic '),
    );
    expect(global.fetch).toBeCalled();
});

it('should setup json type', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        type: 'json',
    });

    expect(headersSet).toBeCalledWith('Content-Type', 'application/json');
    expect(headersSet).toBeCalledWith('Accept', 'application/json');
    expect(global.fetch).toBeCalled();
});

it('should setup xml type', async () => {
    setupResponse('<some><xml>value</xml></some>');

    const result = await request.get({
        url: 'https://sample.com/',
        type: 'xml',
    });

    expect(headersSet).toBeCalledWith('Content-Type', 'application/xml');
    expect(headersSet).toBeCalledWith('Accept', 'application/xml');
    expect(result.body).toEqual({ some: { xml: ['value'] } });
    expect(global.fetch).toBeCalled();
});

describe('Link header', () => {
    it('undefined when no header', async () => {
        setupResponse([{ name: 'org1' }]);
        headersGet.mockReturnValue(null);

        const result = await request.get({ url: 'https://sample.com/' });

        expect(result.links).toBeUndefined();
    });

    it('parses Link header', async () => {
        setupResponse([{ name: 'org1' }]);
        headersGet.mockReturnValue(
            '<https://sample.com/page/3>; rel="next", <https://sample.com/page/1>; rel="prev"',
        );

        const result = await request.get({ url: 'https://sample.com/' });

        expect(result.links).toEqual({
            next: 'https://sample.com/page/3',
            prev: 'https://sample.com/page/1',
        });
    });
});
