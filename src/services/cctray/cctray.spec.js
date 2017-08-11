import 'test/rxHelpers';
import Rx from 'rx/dist/rx.testing';
import cctray from 'services/cctray/cctray';
import requests from 'services/cctray/cctrayRequests';
import sinon from 'sinon';

describe('services/cctray/cctray', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;
    let scheduler;
    let settings;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        sinon.stub(requests, 'projects');

        settings = {
            url: 'http://example.com/',
            projects: ['id']
        };
    });

    afterEach(() => {
        requests.projects.restore();
    });

    const setupResponse = (builds) => requests.projects.returns(
        Rx.Observable.return({
            Projects: {
                Project: builds
            }
        })
    );

    it('returns service info', () => {
        const result = cctray.getInfo();

        expect(result).toEqual({
            typeName: 'CCTray XML',
            baseUrl: 'cctray',
            icon: 'services/cctray/icon.png',
            logo: 'services/cctray/logo.png',
            fields: [
                {
                    type: 'url',
                    name: 'Server URL (cctray XML)',
                    help: 'Example: http://server.com/cc.xml'
                },
                { type: 'username' },
                { type: 'password' }
            ],
            defaultConfig: {
                baseUrl: 'cctray',
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

            cctray.getAll(settings);

            sinon.assert.calledOnce(requests.projects);
            sinon.assert.calledWith(requests.projects, settings);
        });

        it('should return empty sequence if no projects', () => {
            requests.projects.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => cctray.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return projects', () => {
            setupResponse([
                { $: { name: 'name1' } },
                { $: { name: 'name2' } }
            ]);

            const result = scheduler.startScheduler(() => cctray.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'name1',
                    name: 'name1',
                    group: null,
                    isDisabled: false
                }),
                onNext(200, {
                    id: 'name2',
                    name: 'name2',
                    group: null,
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });

        it('should group based on CC.net categories', () => {
            setupResponse([
                { $: { name: 'name', category: 'category' } }
            ]);

            const result = scheduler.startScheduler(() => cctray.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'name',
                    name: 'name',
                    group: 'category',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });

        it('should group based on :: in name', () => {
            setupResponse([
                { $: { name: 'group :: name' } }
            ]);

            const result = scheduler.startScheduler(() => cctray.getAll(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'group :: name',
                    name: 'name',
                    group: 'group',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });

    });

    describe('getLatest', () => {

        it('should pass settings to projects', () => {
            requests.projects.returns(Rx.Observable.empty());

            scheduler.startScheduler(() => cctray.getLatest(settings));

            sinon.assert.calledOnce(requests.projects);
            sinon.assert.calledWith(requests.projects, settings);
        });

        it('should return empty sequence if no projects', () => {
            requests.projects.returns(Rx.Observable.empty());

            const result = scheduler.startScheduler(() => cctray.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onCompleted(200)
            );
        });

        it('should return parsed projects', () => {
            settings.projects = ['name1', 'name2'];
            setupResponse([
                {
                    $: {
                        name: 'name1',
                        lastBuildStatus: 'Success',
                        webUrl: 'http://some.url.1/'
                    }
                },
                {
                    $: {
                        name: 'name2',
                        lastBuildStatus: 'Success',
                        webUrl: 'http://some.url.2/'
                    }
                }
            ]);

            const result = scheduler.startScheduler(() => cctray.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'name1',
                    name: 'name1',
                    group: null,
                    webUrl: 'http://some.url.1/',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onNext(200, {
                    id: 'name2',
                    name: 'name2',
                    group: null,
                    webUrl: 'http://some.url.2/',
                    isDisabled: false,
                    isBroken: false,
                    isRunning: false
                }),
                onCompleted(200)
            );
        });

        it('should group based on :: in name', () => {
            settings.projects = ['group :: name'];
            setupResponse([
                { $: { name: 'group :: name', lastBuildStatus: 'Success' } }
            ]);

            const result = scheduler.startScheduler(() => cctray.getLatest(settings));

            expect(result.messages).toHaveEqualElements(
                onNext(200, {
                    id: 'group :: name',
                    name: 'name',
                    group: 'group',
                    isDisabled: false
                }),
                onCompleted(200)
            );
        });


        describe('parsing', () => {

            it('should return failed build', () => {
                setupResponse([
                    { $: { name: '', lastBuildStatus: 'Failure' } }
                ]);

                const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: true
                }));
            });

            it('should return successful build', () => {
                setupResponse([
                    { $: { name: '', lastBuildStatus: 'Successful' } }
                ]);

                const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isBroken: false
                }));
            });

            it('should return running build', () => {
                setupResponse([
                    { $: { name: '', lastBuildStatus: 'Unknown', activity: 'Building' } }
                ]);

                const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isRunning: true
                }));
            });

            it('should return waiting build', () => {
                setupResponse([
                    { $: { name: '', lastBuildStatus: 'Pending' } }
                ]);

                const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    isWaiting: true
                }));
            });

            it('should return unknown tag', () => {
                setupResponse([
                    { $: { name: '', lastBuildStatus: 'unknown_state' } }
                ]);

                const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                    tags: [{ name: 'Unknown', description: 'Status [unknown_state] not supported' }]
                }));
            });

            describe('changes', () => {

                const createChange = (change) => {
                    setupResponse([
                        {
                            $: {},
                            messages: {
                                message: [
                                    {
                                        $: change
                                    }
                                ]
                            }
                        }
                    ]);
                };

                it('should parse changes', () => {
                    createChange({ text: 'username', kind: 'Breakers' });

                    const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                    expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                        changes: [{ name: 'username' }]
                    }));
                });

                it('should parse only Breakers message', () => {
                    createChange({ text: 'username', kind: 'NotBreakers' });

                    const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                    expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                        changes: []
                    }));
                });

                it('should parse multiple changes', () => {
                    createChange({ text: 'user1, user2', kind: 'Breakers' });

                    const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                    expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                        changes: [
                            { name: 'user1' },
                            { name: 'user2' }
                        ]
                    }));
                });

                it('should ignore changes when empty', () => {
                    createChange({ text: '', kind: 'Breakers' });

                    const result = scheduler.startScheduler(() => cctray.getLatest(settings));

                    expect(result.messages[0].value.value).toEqual(jasmine.objectContaining({
                        changes: []
                    }));
                });

            });

        });

    });
});
