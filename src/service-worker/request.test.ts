import { expect, it, Mock, vi } from 'vitest';
import request from './request';
import errors from './requestErrors';

vi.mock('common/logger');
vi.mock('./requestErrors');

global.fetch = vi.fn();

const setupResponse = (response: any) => {
    (global.fetch as Mock).mockResolvedValue({
        json: () => new Promise(resolve => resolve(response)),
        text: () => new Promise(resolve => resolve(response)),
        ok: true,
        headers: [],
    });
};

const setupErrorResponse = (response: any) => {
    (global.fetch as Mock).mockResolvedValue({
        json: () =>
            new Promise(resolve => {
                throw new Error(response);
            }),
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

    expect(result).toStrictEqual({
        body: [{ name: 'org1' }],
        headers: [],
    });
    expect(global.fetch).toBeCalledWith(
        new URL('https://sample.com/?token=token'),
        expect.anything()
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

    expect(result).rejects.toThrow('error message');
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

    expect(result).rejects.toThrow(error.message);
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
        })
    );
});

it('should set auth if username specified', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        username: 'user',
        password: 'pass',
    });

    expect(global.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: expect.stringContaining('Basic '),
            }),
        })
    );
});

it('should not set auth if username not specified', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        username: undefined,
        password: 'pass',
    });

    expect(global.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            headers: expect.not.objectContaining({
                Authorization: expect.any(String),
            }),
        })
    );
});

it('should set request headers', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        headers: { Authorization: 'token abc' },
    });

    expect(global.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: 'token abc',
            }),
        })
    );
});

it('should setup json type', async () => {
    setupResponse([{ name: 'org1' }]);

    await request.get({
        url: 'https://sample.com/',
        type: 'json',
    });

    expect(global.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            headers: expect.objectContaining({
                ['Content-Type']: 'application/json',
            }),
        })
    );
});

it('should setup xml type', async () => {
    setupResponse('<some><xml>value</xml></some>');

    const result = await request.get({
        url: 'https://sample.com/',
        type: 'xml',
    });

    expect(global.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            headers: expect.objectContaining({
                ['Content-Type']: 'application/xml',
            }),
        })
    );
    expect(result.body).toEqual({ some: { xml: ['value'] } });
});
