import Rx from 'rx';
import poolingService from 'services/poolingService';
import sinon from 'sinon';

describe('services/poolingService', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;

    let settings;
    let service;
    let scheduler;
    let serviceType;
    let PoolingService;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        settings = {
            name: 'settings.name',
            token: 'token',
            projects: ['build1'],
            updateInterval: 1
        };

        if (service) {
            service.events.dispose();
        }
        serviceType = {
            getInfo: () => {},
            getAll: () => {},
            getLatest: () => {}
        };
        sinon.stub(serviceType, 'getInfo');
        sinon.stub(serviceType, 'getAll');
        sinon.stub(serviceType, 'getLatest');
        PoolingService = poolingService.create(serviceType);
        service = new PoolingService(settings, scheduler);
    });

    afterEach(() => {
        serviceType.getAll.restore();
        serviceType.getLatest.restore();
    });

    it('should expose interface', () => {
        expect(service.settings).toBe(settings);
        expect(service.start).toBeDefined();
        expect(service.stop).toBeDefined();
        expect(service.availableBuilds).toBeDefined();
        expect(service.events).toBeDefined();
    });

    describe('settings', () => {

        it('should return service info', () => {
            serviceType.getInfo.returns({ typeName: 'typeName' });

            const result = PoolingService.settings();

            expect(result).toEqual({ typeName: 'typeName' });
            sinon.assert.calledOnce(serviceType.getInfo);
        });

        it('should add updateInterval to fields', () => {
            serviceType.getInfo.returns({
                typeName: 'typeName',
                fields: [
                    { type: 'url', name: 'URL', config: 'url' }
                ],
            });

            const result = PoolingService.settings();

            expect(result).toEqual({
                typeName: 'typeName',
                fields: [
                    { type: 'url', name: 'URL', config: 'url' },
                    { type: 'updateInterval', header: 'Update interval', config: 'updateInterval' }
                ],
            });
            sinon.assert.calledOnce(serviceType.getInfo);
        });

    });

    describe('availableBuilds', () => {

        it('should return availableBuilds', () => {
            const allBuilds = Rx.Observable.empty();
            serviceType.getAll.returns(allBuilds);

            const result = scheduler.startScheduler(() => service.availableBuilds());

            sinon.assert.calledOnce(serviceType.getAll);
            sinon.assert.calledWith(serviceType.getAll, settings);
            expect(result.messages).toHaveEqualElements(
                onNext(200, { items: [] }),
                onCompleted(200)
            );
        });

        it('should sort availableBuilds', () => {
            const allBuilds = Rx.Observable.fromArray([
                { name: 'zzz' },
                { name: 'aaa' }
            ]);
            serviceType.getAll.returns(allBuilds);

            const result = scheduler.startScheduler(() => service.availableBuilds());

            sinon.assert.calledOnce(serviceType.getAll);
            sinon.assert.calledWith(serviceType.getAll, settings);
            expect(result.messages).toHaveEqualElements(
                onNext(200, { items: [
                    { name: 'aaa' },
                    { name: 'zzz' }
                ] }),
                onCompleted(200)
            );
        });

    });

    describe('start', () => {

        xit('should return state after first update', () => {
            serviceType.getLatest.returns(Rx.Observable.return({
                items: [{}]
            }));
            scheduler.scheduleAbsolute(null, 1000, () => {
                service.stop();
            });

            const result = scheduler.startScheduler(() => service.start());

            sinon.assert.calledOnce(serviceType.getLatest);
            sinon.assert.calledWith(serviceType.getLatest, settings);
            expect(result.messages).toHaveEqualElements(
                onNext(201, [{}]),
                onCompleted(201)
            );
        });

        it('should sort items by id', () => {
            serviceType.getLatest.returns(Rx.Observable.fromArray(
                [{ id: 'id2' }, { id: 'id1' }]
            ));

            scheduler.scheduleAbsolute(null, 300, () => {
                service.start().subscribe();
            });
            scheduler.scheduleAbsolute(null, 500, () => {
                service.stop();
            });

            const result = scheduler.startScheduler(() => service.events);

            sinon.assert.calledWith(serviceType.getLatest, settings);
            expect(result.messages).toHaveElements(
                onNext(301, {
                    eventName: 'serviceUpdated',
                    source: settings.name,
                    details: [{ id: 'id1' }, { id: 'id2' }]
                })
            );
        });

        it('should not update builds after stop', () => {
            serviceType.getLatest.returns(Rx.Observable.empty());
            scheduler.scheduleAbsolute(null, 200, () => {
                service.stop();
            });

            scheduler.startScheduler(() => service.start());

            sinon.assert.calledOnce(serviceType.getLatest);
            sinon.assert.calledWith(serviceType.getLatest, settings);
        });

        it('should push serviceUpdated on every update', () => {
            serviceType.getLatest.returns(Rx.Observable.empty());
            scheduler.scheduleAbsolute(null, 2000, () => {
                service.stop();
            });

            const events = [];
            service.events.subscribe((message) => {
                events.push({
                    time: scheduler.clock,
                    message
                });
            });
            scheduler.startScheduler(() => service.start());

            sinon.assert.calledTwice(serviceType.getLatest);
            sinon.assert.calledWith(serviceType.getLatest, settings);

            expect(events).toEqual([
                {
                    time: 101,
                    message: {
                        eventName: 'serviceUpdated',
                        source: settings.name,
                        details: []
                    }
                },
                {
                    time: 1100,
                    message: {
                        eventName: 'serviceUpdated',
                        source: settings.name,
                        details: []
                    }
                }
            ]);
        });

        it('should push serviceUpdateFailed on exception', () => {
            serviceType.getLatest.returns(Rx.Observable.throw({ message: 'some error' }));
            scheduler.scheduleAbsolute(null, 1000, () => {
                service.stop();
            });

            const events = [];
            service.events.subscribe((message) => {
                events.push({
                    time: scheduler.clock,
                    message
                });
            });
            scheduler.startScheduler(() => service.start());

            expect(events).toEqual([
                {
                    time: 101,
                    message: {
                        eventName: 'serviceUpdateFailed',
                        source: settings.name,
                        details: { message: 'some error' }
                    }
                }
            ]);
        });

    });
});
