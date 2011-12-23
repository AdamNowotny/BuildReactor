define(['signals'], function (signals) {

    var MockBuildServiceBuilder = function () {
        this.name = 'Sample service';
        this.updateStarted = new signals.Signal();
        this.updateFinished = new signals.Signal();
        this.buildFailed = new signals.Signal();
        this.buildFixed = new signals.Signal();
        this.errorThrown = new signals.Signal();
        this.withName = function (name) {
            this.name = name;
            return this;
        };
        this.create = function () {
            return {
                name: this.name,
                start: function () { },
                stop: function () { },
                updateStarted: this.updateStarted,
                updateFinished: this.updateFinished,
                buildFailed: this.buildFailed,
                buildFixed: this.buildFixed,
                errorThrown: this.errorThrown
            };
        };
        this.createConstructor = function () {
            var Service = function () {
                this.name = 'Sample service';
                this.updateStarted = new signals.Signal();
                this.updateFinished = new signals.Signal();
                this.buildFailed = new signals.Signal();
                this.buildFixed = new signals.Signal();
                this.errorThrown = new signals.Signal();
                this.start = function () {
                };
                this.stop = function () {
                };
            };
            return Service;
        };
        this.fromSettings = function (settings) {
            this.name = settings.name;
            return this;
        };
        this.withNoName = function () {
            this.name = undefined;
            return this;
        };
        this.withNoBuildFailedSignal = function () {
            this.buildFailed = undefined;
            return this;
        };
        this.withNoBuildFixedSignal = function () {
            this.buildFixed = undefined;
            return this;
        };

        this.withNoUpdateStartedSignal = function () {
            this.updateStarted = undefined;
            return this;
        };

        this.withNoUpdateFinishedSignal = function () {
            this.updateFinished = undefined;
            return this;
        };

        this.withNoErrorThrownSignal = function () {
            this.errorThrown = undefined;
            return this;
        };
    };

    return MockBuildServiceBuilder;
});