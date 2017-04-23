import errors from 'services/errors';

describe('services/buildkite/errors', () => {

    it('should create AjaxError', () => {
        const ex = {
            status: null,
            url: 'https://sample.com/'
        };

        const error = errors.create(ex);

        expect(error.name).toBe('AjaxError');
        expect(error.message).toBe('Connection failed');
        expect(error.status).toBe(null);
        expect(error.url).toBe('https://sample.com/');
    });

    it('should create AjaxError when error object exists', () => {
        const ex = {
            status: 500,
            response: {
                error: {
                    message: 'error message',
                    url: 'https://sample.com/'
                }
            }
        };

        const error = errors.create(ex);

        expect(error.name).toBe('AjaxError');
        expect(error.message).toBe('error message');
        expect(error.status).toBe(500);
        expect(error.url).toBe('https://sample.com/');
    });

    it('should create TimeoutError', () => {
        const ex = {
            status: null,
            timeout: 10000,
            message: 'timeout message'
        };

        const options = {
            url: 'https://sample.com/'
        };
        const error = errors.create(ex, options);

        expect(error.name).toBe('TimeoutError');
        expect(error.message).toBe('timeout message');
        expect(error.status).toBe(null);
        expect(error.url).toBe('https://sample.com/');
    });

    it('should create NotFoundError', () => {
        const ex = {
            status: 404,
            response: {
                notFound: true,
                error: {
                    message: 'error message',
                    url: 'https://sample.com/'
                }
            }
        };

        const error = errors.create(ex);

        expect(error.name).toBe('NotFoundError');
        expect(error.message).toBe('error message');
        expect(error.status).toBe(404);
        expect(error.url).toBe('https://sample.com/');
    });

    it('should create UnauthorisedError', () => {
        const ex = {
            status: 401,
            response: {
                unauthorized: true,
                error: {
                    message: 'error message',
                    url: 'https://sample.com/'
                }
            }
        };

        const error = errors.create(ex);

        expect(error.name).toBe('UnauthorisedError');
        expect(error.message).toBe('error message');
        expect(error.status).toBe(401);
        expect(error.url).toBe('https://sample.com/');
    });

});
