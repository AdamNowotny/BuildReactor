import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import buildkite from 'services/buildkite/buildkite';
import requests from 'services/buildkite/buildkiteRequests';
import sinon from 'sinon';

describe('services/buildkite/buildkite', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    let settings;
    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'organizations');
        sinon.stub(requests, 'pipelines');
        sinon.stub(requests, 'latestBuild');
        sinon.stub(requests, 'latestFinishedBuild');

        settings = {
            token: 'token',
            projects: ['org/pipeline']
        };
    });

    afterEach(() => {
        requests.organizations.restore();
        requests.pipelines.restore();
        requests.latestBuild.restore();
        requests.latestFinishedBuild.restore();
    });

    it('returns service info', () => {
        const result = buildkite.getInfo();

        expect(result).toEqual({
            typeName: 'BuildKite',
            baseUrl: 'buildkite',
            icon: 'services/buildkite/icon.png',
            logo: 'services/buildkite/logo.svg',
            tokenHelp: 'Permissions needed: read_builds, read_organizations, read_pipelines',
            defaultConfig: {
                baseUrl: 'buildkite',
                name: '',
                projects: [],
                token: '',
                updateInterval: 60
            }
        });
    });

    describe('getAll', () => {

        it('should pass token to organizations', () => {
            requests.organizations.returns(Rx.Observable.empty());

            buildkite.getAll(settings);

            sinon.assert.calledOnce(requests.organizations);
            sinon.assert.calledWith(requests.organizations, settings.token);
        });

        it('should return empty sequence if no organizations', () => {
            requests.organizations.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => buildkite.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should pass url and token to pipelines', () => {
            requests.organizations.returns(Rx.Observable.return(
                { name: 'name', pipelines_url: 'url' }
            ));
            requests.pipelines.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => buildkite.getAll(settings));

            sinon.assert.calledOnce(requests.pipelines);
            sinon.assert.calledWith(requests.pipelines, 'url', settings.token);
        });


        it('should return pipelines for organizations', () => {
            requests.organizations.returns(Rx.Observable.return(
                { slug: 'org', name: 'org_name', pipelines_url: 'url' }
            ));
            requests.pipelines.returns(Rx.Observable.fromArray([
                { slug: "slug1", name: 'pipeline1' },
                { slug: "slug2", name: 'pipeline2' }
            ]));

            const result = scheduler.startScheduler(() => buildkite.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'org/slug1',
                    name: 'pipeline1',
                    group: 'org_name',
                    isDisabled: false
                }),
                onNext(200, {
                    id: 'org/slug2',
                    name: 'pipeline2',
                    group: 'org_name',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });
    });

    describe('getLatest', () => {

        it('should pass org, pipeline and token to builds', () => {
            settings.projects = ['org/pipeline1', 'org/pipeline2'];
            requests.latestBuild.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => buildkite.getLatest(settings));

            sinon.assert.calledTwice(requests.latestBuild);
            sinon.assert.calledWith(requests.latestBuild, 'org', 'pipeline1', settings.token);
            sinon.assert.calledWith(requests.latestBuild, 'org', 'pipeline2', settings.token);
        });

        it('should return empty sequence if no builds', () => {
            requests.latestBuild.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return parsed builds', () => {
            settings.projects = ['org/pipeline1', 'org/pipeline2'];
            const build1 = {
                web_url: 'https://buildkite.com/org/pipeline1/builds/15',
                pipeline: { name: 'pipeline1' },
            };
            const build2 = {
                web_url: 'https://buildkite.com/org/pipeline2/builds/2',
                pipeline: { name: 'pipeline2' },
            };
            requests.latestBuild
                .withArgs('org', 'pipeline1', settings.token)
                .returns(Rx.Observable.return(build1))
                .withArgs('org', 'pipeline2', settings.token)
                .returns(Rx.Observable.return(build2));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'org/pipeline1',
                    name: 'pipeline1',
                    group: 'org',
                    webUrl: 'https://buildkite.com/org/pipeline1/builds/15',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onNext(200, {
                    id: 'org/pipeline2',
                    name: 'pipeline2',
                    group: 'org',
                    webUrl: 'https://buildkite.com/org/pipeline2/builds/2',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        it('should return error if updating build fails', () => {
            settings.projects = ['org/pipeline1', 'org/pipeline2'];
            const build2 = {
                web_url: 'https://buildkite.com/org/pipeline2/builds/2',
                pipeline: { name: 'pipeline2' },
            };
            requests.latestBuild
                .withArgs('org', 'pipeline1', settings.token)
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs('org', 'pipeline2', settings.token)
                .returns(Rx.Observable.return(build2));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'org/pipeline1',
                    name: 'pipeline1',
                    group: 'org',
                    error: { message: 'error message' }
                }),
                onNext(200, {
                    id: 'org/pipeline2',
                    name: 'pipeline2',
                    group: 'org',
                    webUrl: 'https://buildkite.com/org/pipeline2/builds/2',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        it('should return failed build', () => {
            requests.latestBuild.returns(Rx.Observable.return({ state: 'failed' }));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isBroken: true
            }));
        });

        it('should return running build', () => {
            requests.latestBuild.returns(Rx.Observable.return({ state: 'running' }));
            requests.latestFinishedBuild.returns(Rx.Observable.return({ state: 'failed' }));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isBroken: true,
                isRunning: true
            }));
        });

        it('should return waiting build', () => {
            requests.latestBuild.returns(Rx.Observable.return({ state: 'scheduled' }));
            requests.latestFinishedBuild.returns(Rx.Observable.return({ state: 'failed' }));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                isBroken: true,
                isRunning: false,
                isWaiting: true
            }));
        });

        it('should parse canceled as tags', () => {
            requests.latestBuild.returns(Rx.Observable.return({ state: 'canceled' }));
            requests.latestFinishedBuild.returns(Rx.Observable.return({ state: 'passed' }));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Canceled', type: 'warning' }]
            }));
        });

        it('should parse canceling as tags', () => {
            requests.latestBuild.returns(Rx.Observable.return({ state: 'canceling' }));
            requests.latestFinishedBuild.returns(Rx.Observable.return({ state: 'failed' }));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Canceled', type: 'warning' }]
            }));
        });

        it('should parse not_run as tags', () => {
            requests.latestBuild.returns(Rx.Observable.return({ state: 'not_run' }));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Not built', type: 'warning' }]
            }));
        });

        it('should parse changes', () => {
            requests.latestBuild.returns(Rx.Observable.return({
                message: 'message',
                creator: { name: 'creator name' }
            }));

            const result = scheduler.startScheduler(() => buildkite.getLatest(settings));

            expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                changes: [{ name: 'creator name', message: 'message' }]
            }));
        });

    });
});
