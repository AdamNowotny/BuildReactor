import Rx from 'rx/dist/rx.testing';
import buildbotRequests from 'services/buildbot/buildbotRequests';
import request from 'services/jsonRequest';

describe('services/buildbot/buildbotRequests', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let settings;

    let scheduler;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        settings = {
            name: 'My CI',
            username: 'username',
            password: 'password',
            url: 'http://example.com/',
            updateInterval: 10000,
            projects: ['PROJECT1-PLAN1', 'PROJECT2-PLAN2']
        };
    });

    describe('allBuilds', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/json/builders',
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => buildbotRequests.allBuilds(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return response body', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    'id1': {}
                }
            }));

            const result = scheduler.startScheduler(() => buildbotRequests.allBuilds(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { 'id1': {} }),
                onCompleted(200)
            );
        });

    });

    describe('lastBuild', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/json/builders/KEY',
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => buildbotRequests.lastBuild('KEY', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return response body', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: { category: 'test' }
            }));

            const result = scheduler.startScheduler(() => buildbotRequests.lastBuild('KEY', settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { category: 'test' }),
                onCompleted(200)
            );
        });

    });

    describe('lastCompletedBuild', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/json/builders/KEY/builds/-1',
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => buildbotRequests.lastCompletedBuild('KEY', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return response body', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: { number: 2 }
            }));

            const result = scheduler.startScheduler(() => buildbotRequests.lastCompletedBuild('KEY', settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { number: 2 }),
                onCompleted(200)
            );
        });

    });

});
