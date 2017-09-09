import Rx from 'rx/dist/rx.testing';
import bambooRequests from 'services/bamboo/bambooRequests';
import request from 'services/request';

describe('services/bamboo/bambooRequests', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let settings;

    let scheduler;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        settings = {
            name: 'My Bamboo CI',
            username: 'username',
            password: 'password',
            url: 'http://example.com/',
            updateInterval: 10000,
            projects: ['PROJECT1-PLAN1', 'PROJECT2-PLAN2']
        };
    });

    describe('projects', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/rest/api/latest/project',
                    query: {
                        expand: 'projects.project.plans.plan',
                        'max-result': 1000,
                        os_authType: 'basic'
                    },
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => bambooRequests.projects(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should set authType to guest when no credentials specified', () => {
            settings.username = null;
            settings.password = null;
            spyOn(request, 'get').and.callFake((data) => {
                expect(data.query.os_authType).toEqual('guest');
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => bambooRequests.projects(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no projects', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: { projects: { project: [] } } })
            );

            const result = scheduler.startScheduler(() => bambooRequests.projects(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return sequence if json array present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    projects: {
                        project: [{ id: 1 }, { id: 2 }]
                    }
                }
            }));

            const result = scheduler.startScheduler(() => bambooRequests.projects(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { id: 1 }),
                onNext(200, { id: 2 }),
                onCompleted(200)
            );
        });

    });

    describe('plan', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/rest/api/latest/plan/KEY',
                    query: {
                        os_authType: 'basic'
                    },
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => bambooRequests.plan('KEY', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should set authType to guest when no credentials specified', () => {
            settings.username = null;
            settings.password = null;
            spyOn(request, 'get').and.callFake((data) => {
                expect(data.query.os_authType).toEqual('guest');
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => bambooRequests.plan('KEY', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return sequence with response body', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    shortName: 'KEY'
                }
            }));

            const result = scheduler.startScheduler(() => bambooRequests.plan('KEY', settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { shortName: 'KEY' }),
                onCompleted(200)
            );
        });

    });

    describe('result', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/rest/api/latest/result/KEY/latest',
                    query: {
                        expand: 'changes.change',
                        os_authType: 'basic'
                    },
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => bambooRequests.result('KEY', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should set authType to guest when no credentials specified', () => {
            settings.username = null;
            settings.password = null;
            spyOn(request, 'get').and.callFake((data) => {
                expect(data.query.os_authType).toEqual('guest');
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => bambooRequests.result('KEY', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return sequence with response body', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    changes: []
                }
            }));

            const result = scheduler.startScheduler(() => bambooRequests.result('KEY', settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { changes: [] }),
                onCompleted(200)
            );
        });

    });

});
