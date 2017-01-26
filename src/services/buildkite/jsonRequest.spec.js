import Rx from 'rx/dist/rx.testing';
import StubSuperagent from 'test/stubSuperagent.js';
import errors from 'services/buildkite/errors';
import request from 'services/buildkite/jsonRequest';
import superagent from 'superagent';

describe('services/buildkite/jsonRequest', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    const onError = Rx.ReactiveTest.onError;

    let scheduler;
    let stub;

    describe('get', () => {

        beforeEach(() => {
            scheduler = new Rx.TestScheduler();
            stub = new StubSuperagent();
            spyOn(superagent, 'get').and.returnValue(stub);
        });

        it('should return response', () => {
            stub.expect('https://sample.com/').respond([{
                name: 'org1'
            }]);

            const result = scheduler.startScheduler(() => request.get({
                url: 'https://sample.com/',
                query: {
                    token: 'token'
                }
            }));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    body: [{
                        name: 'org1'
                    }],
                    headers: []
                }),
                onCompleted(200)
            );
        });

        it('should raise error when request failed', () => {
            const requestError = new Error();
            stub.expect('https://sample.com/').error(requestError);
            const error = {
                name: 'Error',
                message: 'message'
            };
            spyOn(errors, 'create').and.returnValue(error);

            const options = {
                url: 'https://sample.com/'
            };
            const result = scheduler.startScheduler(() => request.get(options));

            expect(errors.create).toHaveBeenCalledWith(requestError, options);
            expect(result.messages).toHaveEqualElements(
                onError(200, error)
            );
        });

        it('should set timeout if specified', () => {
            scheduler.startScheduler(() => request.get({
                url: 'https://sample.com/',
                timeout: 10000
            }));

            expect(stub.timeout).toBe(10000);
        });

        it('should set auth if username specified', () => {
            scheduler.startScheduler(() => request.get({
                url: 'https://sample.com/',
                username: 'user',
                password: 'pass'
            }));

            expect(stub.username).toBe('user');
            expect(stub.password).toBe('pass');
        });

        it('should not set auth if username not specified', () => {
            scheduler.startScheduler(() => request.get({
                url: 'https://sample.com/'
            }));

            expect(stub.username).toBeUndefined();
            expect(stub.password).toBeUndefined();
        });

        it('should set default timeout', () => {
            scheduler.startScheduler(() => request.get({
                url: 'https://sample.com/'
            }));

            expect(stub.timeout).toBe(60000);
        });
    });

});
