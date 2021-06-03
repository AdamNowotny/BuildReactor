import Rx from 'rx/dist/rx.testing';
import buildkiteRequests from 'services/buildkite/buildkiteRequests';
import request from 'core/services/request';

describe('services/buildkite/buildkiteRequests', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    const settings = { token: 'token', branch: 'main' };

    let scheduler;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
    });

    describe('organizations', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'https://api.buildkite.com/v2/organizations',
                    query: { access_token: settings.token }
                });
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() => buildkiteRequests.organizations(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no organizations', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: [] })
            );

            const result = scheduler.startScheduler(() => buildkiteRequests.organizations(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return sequence if json array present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: [
                    { org: 1 }, { org: 2 }
                ]
            }));

            const result = scheduler.startScheduler(() => buildkiteRequests.organizations(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { org: 1 }),
                onNext(200, { org: 2 }),
                onCompleted(200)
            );
        });

    });

    describe('pipelines', () => {

        const url = 'https://api.buildkite.com/v2/organizations/org1/pipelines';

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url,
                    query: {
                        access_token: settings.token,
                        per_page: 100
                    }
                });
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() => buildkiteRequests.pipelines(url, settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no pipelines', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: [] })
            );

            const result = scheduler.startScheduler(() =>
                buildkiteRequests.pipelines(url, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return sequence if pipelines present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: [
                    { org: 1 }, { org: 2 }
                ]
            }));

            const result = scheduler.startScheduler(() =>
                buildkiteRequests.pipelines(url, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onNext(200, { org: 1 }),
                onNext(200, { org: 2 }),
                onCompleted(200)
            );
        });

    });

    describe('latestBuild', () => {

        const org = 'organization';
        const pipeline = 'pipeline';

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
                    query: {
                        access_token: settings.token,
                        per_page: 1,
                        branch: 'main'
                    }
                });
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() => buildkiteRequests.latestBuild(org, pipeline, settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should use master branch by default', () => {
            const noBranchSettings = { token: 'token' };
            spyOn(request, 'get').and.callFake((data) => {
                expect(data.query.branch).toEqual('master');
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() => buildkiteRequests.latestBuild(org, pipeline, noBranchSettings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no builds', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: [] })
            );

            const result = scheduler.startScheduler(() =>
                buildkiteRequests.latestBuild(org, pipeline, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return first build if builds present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: [
                    { build: 1 }, { build: 2 }
                ]
            }));

            const result = scheduler.startScheduler(() =>
                buildkiteRequests.latestBuild(org, pipeline, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onNext(200, { build: 1 }),
                onCompleted(200)
            );
        });

    });

    describe('latestFinishedBuild', () => {

        const org = 'organization';
        const pipeline = 'pipeline';

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: `https://api.buildkite.com/v2/organizations/${org}/pipelines/${pipeline}/builds`,
                    query: {
                        access_token: settings.token,
                        per_page: 1,
                        branch: 'main',
                        'state[]': ['failed', 'passed']
                    }
                });
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() => buildkiteRequests.latestFinishedBuild(org, pipeline, settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should use master branch by default', () => {
            const noBranchSettings = { token: 'token' };
            spyOn(request, 'get').and.callFake((data) => {
                expect(data.query.branch).toEqual('master');
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() => buildkiteRequests.latestFinishedBuild(org, pipeline, noBranchSettings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no builds', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: [] })
            );

            const result = scheduler.startScheduler(() =>
                buildkiteRequests.latestFinishedBuild(org, pipeline, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return first build if builds present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: [
                    { build: 1 }, { build: 2 }
                ]
            }));

            const result = scheduler.startScheduler(() =>
                buildkiteRequests.latestFinishedBuild(org, pipeline, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onNext(200, { build: 1 }),
                onCompleted(200)
            );
        });

    });

});
