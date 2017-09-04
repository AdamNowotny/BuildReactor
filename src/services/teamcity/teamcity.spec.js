import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import requests from 'services/teamcity/teamcityRequests';
import sinon from 'sinon';
import teamcity from 'services/teamcity/teamcity';

describe('services/teamcity/teamcity', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    let settings;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'buildTypes');
        sinon.stub(requests, 'builds');

        settings = {
            url: 'http://example.com/',
            projects: ['key']
        };
    });

    afterEach(() => {
        requests.buildTypes.restore();
        requests.builds.restore();
    });

    describe('getAll', () => {

        it('should return empty sequence if no projects', () => {
            requests.buildTypes.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => teamcity.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return builds', () => {
            requests.buildTypes.returns(Rx.Observable.return({
                buildType: [
                    { id: 'id1', name: 'name1', projectName: 'projectName1' },
                    { id: 'id2', name: 'name2', projectName: 'projectName2' }
                ]
            }));

            const result = scheduler.startScheduler(() => teamcity.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'id1',
                    name: 'name1',
                    group: 'projectName1',
                    isDisabled: false
                }),
                onNext(200, {
                    id: 'id2',
                    name: 'name2',
                    group: 'projectName2',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });
    });

    describe('getLatest', () => {

        it('should pass parameters to get builds', () => {
            settings.projects = ['key1', 'key2'];
            requests.builds.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => teamcity.getLatest(settings));

            sinon.assert.calledTwice(requests.builds);
            sinon.assert.calledWith(requests.builds, 'key1', settings);
            sinon.assert.calledWith(requests.builds, 'key2', settings);
        });

        it('should return empty sequence if no builds', () => {
            requests.builds.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return parsed builds', () => {
            settings.projects = ['key1', 'key2'];
            const build1 = {
                webUrl: 'http://example.com/1',
                running: false,
                status: 'SUCCESS',
                buildType: {
                    name: 'name1',
                    projectName: 'projectName1'
                }
            };
            const build2 = {
                webUrl: 'http://example.com/2',
                running: false,
                status: 'SUCCESS',
                buildType: {
                    name: 'name2',
                    projectName: 'projectName2'
                }
            };
            requests.builds
                .withArgs('key1', settings)
                .returns(Rx.Observable.return({ build: [build1] }))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return({ build: [build2] }));

            const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'key1',
                    name: 'name1',
                    group: 'projectName1',
                    webUrl: 'http://example.com/1',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onNext(200, {
                    id: 'key2',
                    name: 'name2',
                    group: 'projectName2',
                    webUrl: 'http://example.com/2',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        it('should return error if updating build fails', () => {
            settings.projects = ['key1', 'key2'];
            const build2 = {
                webUrl: 'http://example.com/2',
                running: false,
                status: 'SUCCESS',
                buildType: {
                    name: 'name2',
                    projectName: 'projectName2'
                }
            };
            requests.builds
                .withArgs('key1', settings)
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return({ build: [build2] }));

            const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'key1',
                    name: 'key1',
                    group: null,
                    error: { message: 'error message' }
                }),
                onNext(200, {
                    id: 'key2',
                    name: 'name2',
                    group: 'projectName2',
                    webUrl: 'http://example.com/2',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        describe('parsing', () => {

            let build;

            beforeEach(() => {
                build = {
                    webUrl: 'http://example.com/',
                    running: false,
                    status: 'SUCCESS',
                    buildType: {
                        name: 'name2',
                        projectName: 'projectName2'
                    },
                    changes: {
                        change: [
                            { comment: 'comment1', username: 'username1' },
                            { comment: 'comment2\nline2', user: { username: 'username2' } }
                        ]
                    }
                };
            });

            it('should return failed build when FAILURE', () => {
                build.status = 'FAILURE';
                requests.builds.returns(Rx.Observable.return({ build: [build] }));

                const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: true
                }));
            });

            it('should return failed build when ERROR', () => {
                build.status = 'ERROR';
                requests.builds.returns(Rx.Observable.return({ build: [build] }));

                const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: true
                }));
            });

            it('should return successful build when SUCCESS', () => {
                build.status = 'SUCCESS';
                requests.builds.returns(Rx.Observable.return({ build: [build] }));

                const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: false
                }));
            });

            it('should return error when status unknown', () => {
                build.status = 'unknown';
                requests.builds.returns(Rx.Observable.return({ build: [build] }));

                const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    error: { message: 'Status [unknown] not supported' }
                }));
            });

            it('should return error when branch not found', () => {
                settings.branch = 'refs/heads/master';
                requests.builds.returns(Rx.Observable.return({ build: [] }));

                const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    error: { message: 'No build for branch [refs/heads/master]' }
                }));
            });

            it('should return running build', () => {
                build.running = true;
                requests.builds.returns(Rx.Observable.return({ build: [build] }));

                const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isRunning: true
                }));
            });

            it('should parse changes', () => {
                requests.builds.returns(Rx.Observable.return({ build: [build] }));

                const result = scheduler.startScheduler(() => teamcity.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    changes: [
                        { name: 'username1', message: 'comment1' },
                        { name: 'username2', message: 'comment2' }
                    ]
                }));
            });

        });

    });
});
