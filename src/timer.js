define(function () {

    var Timer = function () {
        this.timeout = 0;
        this.elapsed = new signals.Signal();
    };

    Timer.prototype.start = function (seconds) {
        this.timeout = seconds;
        var self = this;
        setTimeout(onTimeout, this.timeout * 1000);

        function onTimeout() {
            self.elapsed.dispatch();
        }
    };

    return Timer;
});