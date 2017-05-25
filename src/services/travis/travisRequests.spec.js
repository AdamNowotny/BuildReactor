import Rx from 'rx/dist/rx.testing';
import request from 'services/jsonRequest';
import travisRequests from 'services/travis/travisRequests';

describe('services/travis/travisRequests', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    const settings = {
        url: 'https://api.travis-ci.org',
        token: 'TOKEN'
    };

    let scheduler;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
    });

    describe('repositories', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: `${settings.url}/repos`,
                    headers: {
                        'Travis-API-Version': 3,
                        'Authorization': `token ${settings.token}`
                    }
                });
                return Rx.Observable.return({ body: { repositories: [] } });
            });

            scheduler.startScheduler(() => travisRequests.repositories(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no organizations', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: { repositories: [] } })
            );

            const result = scheduler.startScheduler(() => travisRequests.repositories(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return sequence if json array present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    repositories: [
                        { org: 1 }, { org: 2 }
                    ]
                }
            }));

            const result = scheduler.startScheduler(() => travisRequests.repositories(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { org: 1 }),
                onNext(200, { org: 2 }),
                onCompleted(200)
            );
        });

    });

    describe('builds', () => {

        const buildId = 'owner/repo';

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: `${settings.url}/repo/owner%2Frepo/builds`,
                    query: {
                        limit: 1,
                        include: 'build.commit'
                    },
                    headers: {
                        'Travis-API-Version': 3,
                        'Authorization': `token ${settings.token}`
                    }
                });
                return Rx.Observable.return({ body: { builds: [] } });
            });

            scheduler.startScheduler(() => travisRequests.builds(buildId, settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no builds', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: { builds: [] } })
            );

            const result = scheduler.startScheduler(() =>
                travisRequests.builds(buildId, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return first build if builds present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    builds: [{ build: 1 }, { build: 2 }]
                }
            }));

            const result = scheduler.startScheduler(() =>
                travisRequests.builds(buildId, settings)
            );

            expect(result.messages).toHaveEqualElements(
                onNext(200, { build: 1 }),
                onCompleted(200)
            );
        });

    });

});
