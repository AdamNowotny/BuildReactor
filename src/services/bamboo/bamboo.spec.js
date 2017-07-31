import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import bamboo from 'services/bamboo/bamboo';
import requests from 'services/bamboo/bambooRequests';
import sinon from 'sinon';

describe('services/bamboo/bamboo', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    let settings;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'projects');
        sinon.stub(requests, 'plan');
        sinon.stub(requests, 'result');

        settings = {
            url: 'http://example.com/',
            projects: ['key']
        };
    });

    afterEach(() => {
        requests.projects.restore();
        requests.plan.restore();
        requests.result.restore();
    });

    it('returns service info', () => {
        const result = bamboo.getInfo();

        expect(result).toEqual({
            typeName: 'Atlassian Bamboo',
            baseUrl: 'bamboo',
            icon: 'services/bamboo/icon.png',
            logo: 'services/bamboo/logo.png',
            fields: [
                {
                    type: 'url',
                    name: 'Server URL, e.g. http://ci.openmrs.org/',
                    help: 'For Bamboo OnDemand use https://[your_account].atlassian.net/builds'
                },
                { type: 'username' },
                { type: 'password' }
            ],
            defaultConfig: {
                baseUrl: 'bamboo',
                name: '',
                projects: [],
                url: '',
                username: '',
                password: '',
                updateInterval: 60
            }
        });
    });

    describe('getAll', () => {

        it('should pass settings to projects', () => {
            requests.projects.returns(Rx.Observable.empty());

            bamboo.getAll(settings);

            sinon.assert.calledOnce(requests.projects);
            sinon.assert.calledWith(requests.projects, settings);
        });

        it('should return empty sequence if no projects', () => {
            requests.projects.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => bamboo.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return plans', () => {
            requests.projects.returns(Rx.Observable.return({
                plans: {
                    plan: [
                        {
                            key: 'key1',
                            shortName: 'shortName1',
                            projectName: 'projectName1',
                            enabled: true
                        },
                        {
                            key: 'key2',
                            shortName: 'shortName2',
                            projectName: 'projectName2',
                            enabled: false
                        }
                    ]
                }
            }));

            const result = scheduler.startScheduler(() => bamboo.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'key1',
                    name: 'shortName1',
                    group: 'projectName1',
                    isDisabled: false
                }),
                onNext(200, {
                    id: 'key2',
                    name: 'shortName2',
                    group: 'projectName2',
                    isDisabled: true
                }),
                onCompleted(200)
            );
        });
    });

    describe('getLatest', () => {

        it('should pass parameters to get plan and result', () => {
            settings.projects = ['key1', 'key2'];
            requests.plan.returns(Rx.Observable.empty());
            requests.result.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => bamboo.getLatest(settings));

            sinon.assert.calledTwice(requests.plan);
            sinon.assert.calledTwice(requests.result);
            sinon.assert.calledWith(requests.plan, 'key1', settings);
            sinon.assert.calledWith(requests.result, 'key2', settings);
        });

        it('should return empty sequence if no builds', () => {
            requests.plan.returns(Rx.Observable.empty());
            requests.result.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return parsed builds', () => {
            settings.projects = ['key1', 'key2'];
            const build1Plan = {
                shortName: 'name1',
                projectName: 'project1',
                isBuilding: false,
                isActive: false,
                enabled: true
            };
            const build1Result = {
                key: 'key1',
                state: 'Successful'
            };
            const build2Plan = {
                shortName: 'name2',
                projectName: 'project2',
                isBuilding: false,
                isActive: false,
                enabled: true
            };
            const build2Result = {
                key: 'key2',
                state: 'Successful'
            };
            requests.plan
                .withArgs('key1', settings)
                .returns(Rx.Observable.return(build1Plan))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(build2Plan));
            requests.result
                .withArgs('key1', settings)
                .returns(Rx.Observable.return(build1Result))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(build2Result));

            const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'key1',
                    name: 'name1',
                    group: 'project1',
                    webUrl: 'http://example.com/browse/key1',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onNext(200, {
                    id: 'key2',
                    name: 'name2',
                    group: 'project2',
                    webUrl: 'http://example.com/browse/key2',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        it('should return error if updating build fails', () => {
            settings.projects = ['key1', 'key2'];
            const build2Plan = {
                shortName: 'name2',
                projectName: 'project2',
                isBuilding: false,
                isActive: false,
                enabled: true
            };
            const build2Result = {
                key: 'key2',
                state: 'Successful'
            };
            requests.plan
                .withArgs('key1', settings)
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(build2Plan));
            requests.result
                .withArgs('key1', settings)
                .returns(Rx.Observable.throw({ message: 'error message' }))
                .withArgs('key2', settings)
                .returns(Rx.Observable.return(build2Result));

            const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'key1',
                    name: 'key1',
                    group: null,
                    error: { message: 'error message' }
                }),
                onNext(200, {
                    id: 'key2',
                    name: 'name2',
                    group: 'project2',
                    webUrl: 'http://example.com/browse/key2',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        describe('parsing', () => {

            let buildPlan;
            let buildResult;

            beforeEach(() => {
                buildPlan = {
                    shortName: 'name',
                    projectName: 'project',
                    isBuilding: false,
                    isActive: false,
                    enabled: true
                };
                buildResult = {
                    key: 'key',
                    state: 'Successful'
                };
            });

            it('should return failed build', () => {
                buildResult.state = 'Failed';
                requests.plan.returns(Rx.Observable.return(buildPlan));
                requests.result.returns(Rx.Observable.return(buildResult));

                const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: true
                }));
            });

            it('should return successful build', () => {
                buildResult.state = 'Successful';
                requests.plan.returns(Rx.Observable.return(buildPlan));
                requests.result.returns(Rx.Observable.return(buildResult));

                const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: false
                }));
            });

            it('should return running build', () => {
                buildPlan.isBuilding = true;
                requests.plan.returns(Rx.Observable.return(buildPlan));
                requests.result.returns(Rx.Observable.return(buildResult));

                const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isRunning: true
                }));
            });

            it('should return waiting build', () => {
                buildPlan.isActive = true;
                requests.plan.returns(Rx.Observable.return(buildPlan));
                requests.result.returns(Rx.Observable.return(buildResult));

                const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isWaiting: true
                }));
            });

            it('should return disabled build', () => {
                buildPlan.enabled = false;
                requests.plan.returns(Rx.Observable.return(buildPlan));
                requests.result.returns(Rx.Observable.return(buildResult));

                const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isDisabled: true
                }));
            });

            it('should return unknown tag', () => {
                buildResult.state = 'unknown_state';
                requests.plan.returns(Rx.Observable.return(buildPlan));
                requests.result.returns(Rx.Observable.return(buildResult));

                const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    tags: [{ name: 'Unknown', description: 'State [unknown_state] not supported' }]
                }));
            });

            it('should parse changes', () => {
                buildResult.changes = {
                    change: [{
                        author: 'author',
                        comment: 'comment'
                    }]
                };
                requests.plan.returns(Rx.Observable.return(buildPlan));
                requests.result.returns(Rx.Observable.return(buildResult));

                const result = scheduler.startScheduler(() => bamboo.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    changes: [{ name: 'author', message: 'comment' }]
                }));
            });

        });

    });
});
