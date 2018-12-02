import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import requests from 'services/travis/travisRequests';
import sinon from 'sinon';
import travis from 'services/travis/travis';

describe('services/travis/travis', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    const settings = {
        token: 'token',
        projects: ['org/pipeline'],
        webUrl: 'https://travis-ci.org/'
    };
    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'repositories');
        sinon.stub(requests, 'builds');
    });

    afterEach(() => {
        requests.repositories.restore();
        requests.builds.restore();
    });

    it('returns service info', () => {
        const result = travis.getInfo();

        expect(result).toEqual({
            typeName: 'Travis',
            baseUrl: 'travis',
            icon: 'services/travis/icon.png',
            logo: 'services/travis/logo.png',
            fields: [
                {
                    type: 'url',
                    name: 'API URL',
                    config: 'apiUrl',
                    help: 'Public: https://api.travis-ci.org, Private: https://api.travis-ci.com or custom url'
                },
                {
                    type: 'url',
                    name: 'Web URL',
                    config: 'webUrl',
                    help: 'Public: https://travis-ci.org, Private: https://travis-ci.com or custom url'
                },
                {
                    type: 'token',
                    help: 'Copy token from <a href="https://travis-ci.org/account/preferences">https://travis-ci.org/account/preferences</a>'
                }
            ],
            defaultConfig: {
                baseUrl: 'travis',
                name: '',
                apiUrl: 'https://api.travis-ci.org/',
                webUrl: 'https://travis-ci.org/',
                projects: [],
                token: '',
                updateInterval: 60
            }
        });
    });

    describe('getAll', () => {

        it('should pass parameters to repositories', () => {
            requests.repositories.returns(Rx.Observable.empty());

            travis.getAll(settings);

            sinon.assert.calledOnce(requests.repositories);
            sinon.assert.calledWith(requests.repositories, settings);
        });

        it('should return empty sequence if no repositories', () => {
            requests.repositories.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => travis.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return repositories', () => {
            requests.repositories.returns(Rx.Observable.fromArray([
                { slug: 'org1/repo1', name: 'repository1', active: true },
                { slug: 'org2/repo2', name: 'repository2', active: true }
            ]));

            const result = scheduler.startScheduler(() => travis.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'org1/repo1',
                    name: 'repository1',
                    group: 'org1',
                    isDisabled: false
                }),
                onNext(200, {
                    id: 'org2/repo2',
                    name: 'repository2',
                    group: 'org2',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });

        it('should filter not active repositories', () => {
            requests.repositories.returns(Rx.Observable.fromArray([
                { slug: 'org1/repo1', name: 'repository1', active: false },
                { slug: 'org2/repo2', name: 'repository2', active: true }
            ]));

            const result = scheduler.startScheduler(() => travis.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'org2/repo2',
                    name: 'repository2',
                    group: 'org2',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });
    });

    describe('getLatest', () => {

        it('should pass parameters to builds', () => {
            settings.projects = ['org/repo1', 'org/repo2'];
            requests.builds.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => travis.getLatest(settings));

            sinon.assert.calledTwice(requests.builds);
            sinon.assert.calledWith(requests.builds, 'org/repo1', settings);
            sinon.assert.calledWith(requests.builds, 'org/repo2', settings);
        });

        it('should return empty sequence if no builds', () => {
            requests.builds.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return parsed builds', () => {
            settings.projects = ['org/repo1', 'org/repo2'];
            const build1 = {
                id: 12345,
                state: 'passed',
                commit: {
                    author: {
                        name: 'author name'
                    }
                }
            };
            const build2 = {
                id: 101010,
                state: 'passed',
                commit: {
                    author: {
                        name: 'author name'
                    }
                }
            };
            requests.builds
                .withArgs('org/repo1', settings)
                .returns(Rx.Observable.return(build1))
                .withArgs('org/repo2', settings)
                .returns(Rx.Observable.return(build2));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'org/repo1',
                    name: 'repo1',
                    group: 'org',
                    webUrl: 'https://travis-ci.org/org/repo1/builds/12345',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onNext(200, {
                    id: 'org/repo2',
                    name: 'repo2',
                    group: 'org',
                    webUrl: 'https://travis-ci.org/org/repo2/builds/101010',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        it('should return error if updating build fails', () => {
            settings.projects = ['org/repo1', 'org/repo2'];
            const build2 = {
                id: 101510,
                state: 'passed',
                commit: {
                    author: {
                        name: 'author name'
                    }
                }
            };
            requests.builds
                .withArgs('org/repo1', settings)
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs('org/repo2', settings)
                .returns(Rx.Observable.return(build2));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'org/repo1',
                    name: 'repo1',
                    group: 'org',
                    error: { message: 'error message' }
                }),
                onNext(200, {
                    id: 'org/repo2',
                    name: 'repo2',
                    group: 'org',
                    webUrl: 'https://travis-ci.org/org/repo2/builds/101510',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        it('should return failed build', () => {
            requests.builds.returns(Rx.Observable.return({ state: 'failed' }));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isBroken: true
            }));
        });

        it('should return running build', () => {
            requests.builds.returns(Rx.Observable.return({
                state: 'started',
                previous_state: 'failed'
            }));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isRunning: true,
                isWaiting: false,
                isBroken: true
            }));
        });

        it('should return waiting build', () => {
            requests.builds.returns(Rx.Observable.return({
                state: 'created',
                previous_state: 'failed'
            }));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isWaiting: true,
                isRunning: false,
                isBroken: true
            }));
        });

        it('should parse errored as tags', () => {
            requests.builds.returns(Rx.Observable.return({ state: 'errored' }));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Errored', type: 'warning' }],
                isBroken: true
            }));
        });

        it('should mark unknown state as tags', () => {
            requests.builds.returns(Rx.Observable.return({ state: 'unknown state' }));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{
                    name: 'Unknown',
                    type: 'warning',
                    description: `Result [unknown state] is unknown`
                }]
            }));
        });

        it('should parse changes', () => {
            requests.builds.returns(Rx.Observable.return({
                commit: {
                    message: 'message',
                    author: {
                        name: 'author name'
                    }
                }
            }));

            const result = scheduler.startScheduler(() => travis.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                changes: [{ name: 'author name', message: 'message' }]
            }));
        });

    });
});
