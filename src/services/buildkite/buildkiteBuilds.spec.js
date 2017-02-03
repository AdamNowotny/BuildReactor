import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import builds from 'services/buildkite/buildkiteBuilds';
import parser from 'services/buildkite/parser';
import requests from 'services/buildkite/buildkiteRequests';
import sinon from 'sinon';

describe('services/buildkite/buildkiteBuilds', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    let settings;
    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'organizations');
        sinon.stub(requests, 'pipelines');
        sinon.stub(requests, 'builds');
        sinon.stub(parser, 'parseBuild');

        settings = {
            token: 'token',
            projects: ['org/pipeline1', 'org/pipeline2']
        };
    });

    afterEach(() => {
        requests.organizations.restore();
        requests.pipelines.restore();
        requests.builds.restore();
        parser.parseBuild.restore();
    });

    describe('getAll', () => {

        it('should pass token to organizations', () => {
            requests.organizations.returns(Rx.Observable.return([]));

            builds.getAll(settings);

            sinon.assert.calledOnce(requests.organizations);
            sinon.assert.calledWith(requests.organizations, settings.token);
        });

        it('should return empty items if no organizations', () => {
            requests.organizations.returns(Rx.Observable.return([]));

            const result = scheduler.startScheduler(() => builds.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { items: [] }),
                onCompleted(200)
            );
        });

        it('should pass url and token to pipelines', () => {
            requests.organizations.returns(Rx.Observable.return([
                { name: 'name', pipelines_url: 'url' }
            ]));
            requests.pipelines.returns(Rx.Observable.return([]));

            scheduler.startScheduler(() => builds.getAll(settings));

            sinon.assert.calledOnce(requests.pipelines);
            sinon.assert.calledWith(requests.pipelines, 'url', settings.token);
        });


        it('should return sorted pipelines for organizations', () => {
            requests.organizations.returns(Rx.Observable.return([
                { slug: 'org', name: 'org_name', pipelines_url: 'url' }
            ]));
            requests.pipelines.returns(Rx.Observable.return([
                { slug: "slug2", name: 'pipeline2' },
                { slug: "slug1", name: 'pipeline1' }
            ]));

            const result = scheduler.startScheduler(() => builds.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    items: [
                        {
                            id: 'org/slug1',
                            name: 'pipeline1',
                            group: 'org_name',
                            isDisabled: false
                        },
                        {
                            id: 'org/slug2',
                            name: 'pipeline2',
                            group: 'org_name',
                            isDisabled: false
                        }
                    ]
                }),
                onCompleted(200)
            );
        });
    });

    describe('getLatest', () => {

        it('should pass org, pipeline and token to builds', () => {
            requests.builds.returns(Rx.Observable.return([]));

            scheduler.startScheduler(() => builds.getLatest(settings));

            sinon.assert.calledTwice(requests.builds);
            sinon.assert.calledWith(requests.builds, 'org', 'pipeline1', settings.token);
            sinon.assert.calledWith(requests.builds, 'org', 'pipeline2', settings.token);
        });

        it('should return empty items if no builds', () => {
            requests.builds.returns(Rx.Observable.return([]));

            const result = scheduler.startScheduler(() => builds.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { items: [] }),
                onCompleted(200)
            );
        });

        it('should return parsed builds', () => {
            const build1 = { pipeline: { name: 'pipeline1' } };
            const build2 = { pipeline: { name: 'pipeline2' } };
            requests.builds
                .withArgs('org', 'pipeline1', settings.token)
                .returns(Rx.Observable.return([build1]))
                .withArgs('org', 'pipeline2', settings.token)
                .returns(Rx.Observable.return([build2]));

            parser.parseBuild
                .withArgs(build1, { org: 'org', pipeline: 'pipeline1' })
                .returns({ id: 'org/pipeline1', name: 'pipeline1' })
                .withArgs(build2, { org: 'org', pipeline: 'pipeline2' })
                .returns({ id: 'org/pipeline2', name: 'pipeline2' });

            const result = scheduler.startScheduler(() => builds.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200),
                onCompleted(200)
            );
            expect(result.messages[0].value.value.items[0].name).toBe('pipeline1');
            expect(result.messages[0].value.value.items[1].name).toBe('pipeline2');
        });

    });
});
