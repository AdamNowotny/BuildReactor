import Rx from 'rx';
import builds from 'services/buildkite/buildkiteBuilds';

class BuildKite {
    constructor(settings, scheduler) {
        this.settings = settings;
        this.events = new Rx.Subject();
        this.activeProjects = new Rx.BehaviorSubject({
            name: this.settings.name,
            items: []
        });
        this.scheduler = scheduler;
        this.updates = new Rx.Subject();
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
            .select((result) => result.items);
    }

    start() {
        const interval = this.settings.updateInterval * 1000;
        const scheduler = this.scheduler;
        this.updatesSubscription = Rx.Observable.timer(0, interval, scheduler)
            .selectMany(() => this.updateAll(this.settings))
            .do((items) => this.events.onNext({
                eventName: 'serviceUpdated',
                source: this.settings.name,
                details: items
            }))
            .subscribe(this.updates);
        return this.updates
            .take(1)
            .do((items) => this.events.onNext({
                eventName: 'serviceStarted',
                source: this.settings.name,
                details: items
            }));
    }

    stop() {
        if (this.updatesSubscription) {
            this.updatesSubscription.dispose();
        }
        this.events.onNext({ eventName: 'serviceStopped', source: this.settings.name });
    }

    availableBuilds() {
        return builds.getAll(this.settings);
    }
}

export default BuildKite;
