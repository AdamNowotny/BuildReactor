import Rx from 'rx';
import sortBy from 'common/sortBy';

const create = (serviceType) => class PoolingService {

    constructor(settings, scheduler) {
        this.settings = settings;
        this.events = new Rx.Subject();
        this.scheduler = scheduler;
    }

    static settings() {
        return serviceType.getInfo();
    }

    updateAll(settings) {
        return serviceType.getLatest(settings)
            .select((result) => result.items)
            .select((items) => sortBy('id', items))
            .do((items) => this.events.onNext({
                eventName: 'serviceUpdated',
                source: this.settings.name,
                details: items
            }))
            .catch((ex) => {
                this.events.onNext({
                    eventName: 'serviceUpdateFailed',
                    source: this.settings.name,
                    details: ex
                });
                return Rx.Observable.return([]);
            });
    }

    start() {
        const updates = new Rx.Subject();
        const interval = this.settings.updateInterval * 1000;
        this.updatesSubscription = Rx.Observable.timer(0, interval, this.scheduler)
            .selectMany(() => this.updateAll(this.settings))
            .subscribe(updates);
        return updates.take(1);
    }

    stop() {
        if (this.updatesSubscription) {
            this.updatesSubscription.dispose();
        }
    }

    availableBuilds() {
        return serviceType.getAll(this.settings);
    }
};

export default {
    create
};
