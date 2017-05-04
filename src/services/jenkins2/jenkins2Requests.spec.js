import Rx from 'rx/dist/rx.testing';
import jenkins2Requests from 'services/jenkins2/jenkins2Requests';
import request from 'services/jsonRequest';

describe('services/jenkins2/jenkins2Requests', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    const settings = {
        username: 'username',
        password: 'password',
        url: 'http://example.com'
    };

    let scheduler;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
    });

    describe('jobs', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/api/json?tree=' +
                    'jobs[_class,name,url,buildable,fullName,' +
                        'jobs[_class,name,url,buildable,fullName,' +
                            'jobs[_class,name,url,buildable,fullName]' +
                        ']' +
                    ']',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.return({ body: { jobs: [] } });
            });

            scheduler.startScheduler(() =>
                jenkins2Requests.jobs({ url: settings.url, settings })
            );

            expect(request.get).toHaveBeenCalled();
        });

        it('should return empty sequence if no jobs', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: { jobs: [] } })
            );

            const result = scheduler.startScheduler(() =>
                jenkins2Requests.jobs({ url: settings.url, settings })
            );

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return sequence if json array present', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    jobs: [
                        { id: 'id1' },
                        { id: 'id2' }
                    ]
                }
            }));

            const result = scheduler.startScheduler(() =>
                jenkins2Requests.jobs({ url: settings.url, settings })
            );

            expect(result.messages).toHaveEqualElements(
                onNext(200, { id: 'id1' }),
                onNext(200, { id: 'id2' }),
                onCompleted(200)
            );
        });

    });

    describe('jobDetails', () => {

        const id = 'folder/project/branch';

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/job/folder/job/project/job/branch/api/json?tree=' +
                        'buildable,inQueue,' +
                        'lastBuild[url,building,number,' +
                            'changeSets[items[author[fullName],msg]],' +
                            'changeSet[items[author[fullName],msg]]' +
                        '],' +
                        'lastCompletedBuild[result]',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() =>
                jenkins2Requests.jobDetails({ id, settings })
            );

            expect(request.get).toHaveBeenCalled();
        });

        it('should pass request parameters for project without branches', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/job/folder/job/project/api/json?tree=' +
                        'buildable,inQueue,' +
                        'lastBuild[url,building,number,' +
                            'changeSets[items[author[fullName],msg]],' +
                            'changeSet[items[author[fullName],msg]]' +
                        '],' +
                        'lastCompletedBuild[result]',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() =>
                jenkins2Requests.jobDetails({ id: 'folder/project', settings }));

            expect(request.get).toHaveBeenCalled();
        });

        it('should pass request parameters for freestyle and Jenkins 1.x projects', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/job/project/api/json?tree=' +
                        'buildable,inQueue,' +
                        'lastBuild[url,building,number,' +
                            'changeSets[items[author[fullName],msg]],' +
                            'changeSet[items[author[fullName],msg]]' +
                        '],' +
                        'lastCompletedBuild[result]',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.return({ body: [] });
            });

            scheduler.startScheduler(() =>
                jenkins2Requests.jobDetails({ id: 'project', settings }));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return response', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: { id: 'id' } })
            );

            const result = scheduler.startScheduler(() =>
                jenkins2Requests.jobDetails({ id, settings })
            );

            expect(result.messages).toHaveEqualElements(
                onNext(200, { id: 'id' }),
                onCompleted(200)
            );
        });

    });

});
