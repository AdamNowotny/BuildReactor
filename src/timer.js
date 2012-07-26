define(['signals'], function (signals) {

	'use strict';
	
	var Timer = function () {
		this.timeout = 0;
		this.on = {
			elapsed: new signals.Signal()
		};
	};

	Timer.prototype.start = function (seconds) {
		function onTimeout() {
			self.on.elapsed.dispatch();
		}

		this.timeout = seconds;
		var self = this;
		setTimeout(onTimeout, this.timeout * 1000);

	
	};

	return Timer;
});