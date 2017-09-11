import Rx from 'rx/dist/rx.testing';
import request from 'core/services/request';
import teamcityRequests from 'services/teamcity/teamcityRequests';

describe('services/teamcity/teamcityRequests', () => {

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
            projects: ['ID1', 'ID2']
        };
    });

    describe('buildTypes', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/httpAuth/app/rest/buildTypes',
                    query: {
                        fields: 'buildType(id,name,projectName)'
                    },
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => teamcityRequests.buildTypes(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should pass request parameters for guest user', () => {
            settings.username = '';
            settings.password = '';
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/guestAuth/app/rest/buildTypes',
                    query: {
                        fields: 'buildType(id,name,projectName)'
                    },
                    type: 'json',
                    username: '',
                    password: ''
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => teamcityRequests.buildTypes(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return response body', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: {
                    'id1': {}
                }
            }));

            const result = scheduler.startScheduler(() => teamcityRequests.buildTypes(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { 'id1': {} }),
                onCompleted(200)
            );
        });

    });

    describe('builds', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/httpAuth/app/rest/builds',
                    query: {
                        locator: 'buildType:ID1,running:any,count:1',
                        fields: 'build(running,status,webUrl,buildType(name,projectName),' +
                            'changes(change(comment,username,user(username))))'
                    },
                    type: 'json',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => teamcityRequests.builds('ID1', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should pass request parameters for guest', () => {
            settings.username = '';
            settings.password = '';
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual(jasmine.objectContaining({
                    url: 'http://example.com/guestAuth/app/rest/builds'
                }));
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => teamcityRequests.builds('ID1', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should pass request parameters for branch', () => {
            settings.branch = 'refs/heads/master';
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual(jasmine.objectContaining({
                    query: {
                        locator: 'buildType:ID1,running:any,count:1,branch:(refs/heads/master)',
                        fields: 'build(running,status,webUrl,buildType(name,projectName),' +
                            'changes(change(comment,username,user(username))))'
                    }
                }));
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => teamcityRequests.builds('ID1', settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return response body', () => {
            spyOn(request, 'get').and.returnValue(Rx.Observable.return({
                body: { field: 'test' }
            }));

            const result = scheduler.startScheduler(() => teamcityRequests.builds('KEY', settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { field: 'test' }),
                onCompleted(200)
            );
        });

    });

});
