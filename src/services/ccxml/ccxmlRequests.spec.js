import Rx from 'rx/dist/rx.testing';
import bambooRequests from 'services/ccxml/ccxmlRequests';
import request from 'services/jsonRequest';

describe('services/ccxml/ccxmlRequests', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let settings;

    let scheduler;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        settings = {
            username: 'username',
            password: 'password',
            url: 'http://example.com/'
        };
    });

    describe('projects', () => {

        it('should pass request parameters', () => {
            spyOn(request, 'get').and.callFake((data) => {
                expect(data).toEqual({
                    url: 'http://example.com/',
                    type: 'xml',
                    username: settings.username,
                    password: settings.password
                });
                return Rx.Observable.never();
            });

            scheduler.startScheduler(() => bambooRequests.projects(settings));

            expect(request.get).toHaveBeenCalled();
        });

        it('should return response', () => {
            spyOn(request, 'get').and.returnValue(
                Rx.Observable.return({ body: { Projects: { Project: [] } } })
            );

            const result = scheduler.startScheduler(() => bambooRequests.projects(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, { Projects: { Project: [] } }),
                onCompleted(200)
            );
        });

    });

});
