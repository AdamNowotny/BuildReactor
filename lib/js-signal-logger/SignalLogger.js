define(['signals'], function () {

    var SignalLogger = function (signalSpec) {
        if (signalSpec == null) throw 'Logger configuration not specified';
        this.signalSpec = signalSpec;
        var that = this;
        initialize();

        function initialize() {
            for (var signalName in signalSpec) {
                var signal = signalSpec[signalName];
                that[signalName] = new SignalInfo(signalName, signal);
            }
        }

    };

    SignalLogger.prototype.reset = function () {
        for (var signalName in this.signalSpec) {
            this[signalName].reset();
        }
    };

    var SignalInfo = function (signalName, signal) {
        if (signal == null) throw 'Signal does not exist: ' + signalName;
        this.name = signalName;
        this.signal = signal;
        this.count = 0;
        this.lastCallParams = [];
        this.initialize();
        this.reset();
    };

    SignalInfo.prototype.initialize = function () {
        this.signal.add(onSignal, this);

        function onSignal(parameters) {
            if (!this.filter(parameters)) {
                return;
            }
            this.count++;
            this.lastCallParams = parameters;
        };
    };

    SignalInfo.prototype.reset = function () {
        this.count = 0;
        this.filter = trueFilter;


        function trueFilter() {
            return true;
        }
    };

    SignalInfo.prototype.setFilter = function (predicate) {
        this.filter = predicate;
    };

    SignalInfo.prototype.matchValues = function () {
        var expectedArgs = arguments;
        this.filter = function () {
            for (var i = 0; i < expectedArgs.length; i++) {
                if (arguments[i] !== expectedArgs[i]) {
                    return false;
                }
            }
            return true;
        };
    };

    return SignalLogger;
});