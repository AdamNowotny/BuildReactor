import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import buildbot from 'services/buildbot/buildbot';
import requests from 'services/buildbot/buildbotRequests';
import sinon from 'sinon';

describe('services/buildbot/buildbot', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    let settings;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'allBuilds');
        sinon.stub(requests, 'lastBuild');
        sinon.stub(requests, 'lastCompletedBuild');

        settings = {
            url: 'http://example.com/',
            projects: ['key']
        };
    });

    afterEach(() => {
        requests.allBuilds.restore();
        requests.lastBuild.restore();
        requests.lastCompletedBuild.restore();
    });

    describe('getAll', () => {

        it('should return empty sequence if no projects', () => {
            requests.allBuilds.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => buildbot.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return builds', () => {
            requests.allBuilds.returns(Rx.Observable.return({
                'id1': { category: 'category1' },
                'id2': { category: 'category2' }
            }));

            const result = scheduler.startScheduler(() => buildbot.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'id1',
                    name: 'id1',
                    group: 'category1',
                    isDisabled: false
                }),
                onNext(200, {
                    id: 'id2',
                    name: 'id2',
                    group: 'category2',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });
    });

    describe('getLatest', () => {

        it('should pass parameters to get plan and result', () => {
            settings.projects = ['key1', 'key2'];
            requests.lastBuild.returns(Rx.Observable.empty());
            requests.lastCompletedBuild.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => buildbot.getLatest(settings));

            sinon.assert.calledTwice(requests.lastBuild);
            sinon.assert.calledTwice(requests.lastCompletedBuild);
            sinon.assert.calledWith(requests.lastBuild, 'key1', settings);
            sinon.assert.calledWith(requests.lastCompletedBuild, 'key2', settings);
        });

        it('should return empty sequence if no builds', () => {
            requests.lastBuild.returns(Rx.Observable.empty());
            requests.lastCompletedBuild.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => buildbot.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return parsed builds', () => {
            settings.projects = ['key1', 'key2'];
            const build1 = {
                category: 'category1',
                state: 'idle'
            };
            const buildCompleted1 = {
                text: [],
                blame: []
            };
            const build2 = {
                category: 'category2',
                state: 'idle'
            };
            const buildCompleted2 = {
                text: [],
                blame: []
            };
            requests.lastBuild
                .withArgs('key1', settings)
                .returns(Rx.Observable.return(build1))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(build2));
            requests.lastCompletedBuild
                .withArgs('key1', settings)
                .returns(Rx.Observable.return(buildCompleted1))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(buildCompleted2));

            const result = scheduler.startScheduler(() => buildbot.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'key1',
                    name: 'key1',
                    group: 'category1',
                    webUrl: 'http://example.com/builders/key1',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onNext(200, {
                    id: 'key2',
                    name: 'key2',
                    group: 'category2',
                    webUrl: 'http://example.com/builders/key2',
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
                category: 'category2',
                state: 'idle'
            };
            const buildCompleted2 = {
                text: [],
                blame: []
            };
            requests.lastBuild
                .withArgs('key1', settings)
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(build2));
            requests.lastCompletedBuild
                .withArgs('key1', settings)
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(buildCompleted2));

            const result = scheduler.startScheduler(() => buildbot.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'key1',
                    name: 'key1',
                    group: null,
                    error: { message: 'error message' }
                }),
                onNext(200, {
                    id: 'key2',
                    name: 'key2',
                    group: 'category2',
                    webUrl: 'http://example.com/builders/key2',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        describe('parsing', () => {

            let build;
            let completedBuild;

            beforeEach(() => {
                build = {
                    category: 'category',
                    state: 'idle'
                };
                completedBuild = {
                    text: [],
                    blame: []
                };
            });

            it('should return failed build', () => {
                completedBuild.text.push('failed');
                requests.lastBuild.returns(Rx.Observable.return(build));
                requests.lastCompletedBuild.returns(Rx.Observable.return(completedBuild));

                const result = scheduler.startScheduler(() => buildbot.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: true
                }));
            });

            it('should return running build', () => {
                build.state = 'building';
                requests.lastBuild.returns(Rx.Observable.return(build));
                requests.lastCompletedBuild.returns(Rx.Observable.return(completedBuild));

                const result = scheduler.startScheduler(() => buildbot.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isRunning: true
                }));
            });

            it('should return disabled build', () => {
                build.state = 'offline';
                requests.lastBuild.returns(Rx.Observable.return(build));
                requests.lastCompletedBuild.returns(Rx.Observable.return(completedBuild));

                const result = scheduler.startScheduler(() => buildbot.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isDisabled: true
                }));
            });

            it('should parse changes', () => {
                completedBuild.blame.push('Name <email@example.com>');
                requests.lastBuild.returns(Rx.Observable.return(build));
                requests.lastCompletedBuild.returns(Rx.Observable.return(completedBuild));

                const result = scheduler.startScheduler(() => buildbot.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    changes: [{ name: 'Name <email@example.com>' }]
                }));
            });

        });

    });
});
