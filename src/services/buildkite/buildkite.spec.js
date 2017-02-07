import BuildKite from 'services/buildkite/buildkite';
import Rx from 'rx';
import builds from 'services/buildkite/buildkiteBuilds';
import sinon from 'sinon';

describe('services/buildkite/buildkite', () => {

    const onNext = Rx.ReactiveTest.onNext;
    const onCompleted = Rx.ReactiveTest.onCompleted;

    let settings;
    let service;
    let scheduler;

    beforeEach(() => {
        scheduler = new Rx.TestScheduler();
        settings = {
            name: 'settings.name',
            token: 'token',
            projects: ['build1'],
            updateInterval: 1
        };
        sinon.stub(builds, 'getAll');
        sinon.stub(builds, 'getLatest');

        if (service) {
            service.events.dispose();
        }
        service = new BuildKite(settings, scheduler);
    });

    afterEach(() => {
        builds.getAll.restore();
        builds.getLatest.restore();
    });

    it('should expose interface', () => {
        expect(service.settings).toBe(settings);
        expect(service.start).toBeDefined();
        expect(service.stop).toBeDefined();
        expect(service.availableBuilds).toBeDefined();
        expect(service.events).toBeDefined();
    });

    it('should return availableBuilds', () => {
        const allBuilds = Rx.Observable.return([]);
        builds.getAll.returns(allBuilds);

        const result = service.availableBuilds();

        expect(result).toBe(allBuilds);
        sinon.assert.calledOnce(builds.getAll);
        sinon.assert.calledWith(builds.getAll, settings);
    });

    describe('start', () => {

        xit('should return state after first update', () => {
            builds.getLatest.returns(Rx.Observable.return({
                items: [{}]
            }));
            scheduler.scheduleAbsolute(null, 1000, () => {
                service.stop();
            });

            const result = scheduler.startScheduler(() => service.start());

            sinon.assert.calledOnce(builds.getLatest);
            sinon.assert.calledWith(builds.getLatest, settings);
            expect(result.messages).toHaveEqualElements(
                onNext(201, [{}]),
                onCompleted(201)
            );
        });

        it('should sort items by id', () => {
            builds.getLatest.returns(Rx.Observable.return({
                items: [{ id: 'id2' }, { id: 'id1' }]
            }));

            scheduler.scheduleAbsolute(null, 300, () => {
                service.start().subscribe();
            });
            scheduler.scheduleAbsolute(null, 500, () => {
                service.stop();
            });

            const result = scheduler.startScheduler(() => service.events);

            sinon.assert.calledWith(builds.getLatest, settings);
            expect(result.messages).toHaveElements(
                onNext(301, {
                    eventName: 'serviceUpdated',
                    source: settings.name,
                    details: [{ id: 'id1' }, { id: 'id2' }]
                })
            );
        });

        it('should not update builds after stop', () => {
            builds.getLatest.returns(Rx.Observable.return({ items: [] }));
            scheduler.scheduleAbsolute(null, 200, () => {
                service.stop();
            });

            scheduler.startScheduler(() => service.start());

            sinon.assert.calledOnce(builds.getLatest);
            sinon.assert.calledWith(builds.getLatest, settings);
        });

        it('should push serviceUpdated on every update', () => {
            builds.getLatest.returns(Rx.Observable.return({ items: [] }));
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

            sinon.assert.calledTwice(builds.getLatest);
            sinon.assert.calledWith(builds.getLatest, settings);

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
            builds.getLatest.returns(Rx.Observable.throw({ message: 'some error' }));
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
                        details: null
                    }
                }
            ]);
        });

        it('should add serviceIcon and serviceName to buildUpdated', () => {

        });

    });
});
