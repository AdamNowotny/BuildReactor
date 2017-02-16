import Rx from 'rx';
import builds from 'services/buildkite/buildkiteBuilds';
import sortBy from 'common/sortBy';

class BuildKite {
    constructor(settings, scheduler) {
        this.settings = settings;
        this.events = new Rx.Subject();
        this.scheduler = scheduler;
    }

    static settings() {
        return {
            typeName: 'BuildKite',
            baseUrl: 'buildkite',
            icon: 'services/buildkite/icon.png',
            logo: 'services/buildkite/logo.svg',
            defaultConfig: {
                baseUrl: 'buildkite',
                name: '',
                projects: [],
                token: '',
                updateInterval: 60
            }
        };
    }

    updateAll(settings) {
        return builds.getLatest(settings)
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
                    details: null
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
        return builds.getAll(this.settings);
    }
}

export default BuildKite;
