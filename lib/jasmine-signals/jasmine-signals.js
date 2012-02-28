jasmine.signals = {};

/*
* Spies definitions
*/

jasmine.signals.spyOnSignal = function (signal, matcher) {
	var spy = new jasmine.signals.SignalSpy(signal, matcher);
	return spy;
};

var spyOnSignal = jasmine.signals.spyOnSignal;

/*
 * Matchers
 */

jasmine.signals.matchers = {
	toHaveBeenDispatched: function (expectedCount) {
		if (!(this.actual instanceof jasmine.signals.SignalSpy)) {
			throw new Error('Expected a SignalSpy');
		}
		if (expectedCount === undefined) {
			return this.actual.count > 0;
		} else {
			return this.actual.count === expectedCount;
		}
	}
};

beforeEach(function () {
	this.addMatchers(jasmine.signals.matchers);
});

/*
 * Spy implementation
 */

(function(namespace) {
	namespace.SignalSpy = function (signal, matcher) {
		if (!(signal instanceof signals.Signal)) {
			throw 'spyOnSignal requires a signal as a parameter';
		}
		this.signal = signal;
		this.matcher = matcher || allSignalsMatcher;
		this.count = 0;
		this.initialize();
	};

	function allSignalsMatcher() {
		return true;
	}

	namespace.SignalSpy.prototype.initialize = function () {
		this.signal.add(onSignal, this);

		function onSignal(parameters) {
			if (this.matcher(parameters)) {
				this.count++;
			}
		};
	};

	namespace.SignalSpy.prototype.reset = function () {
		this.count = 0;
	};

	namespace.SignalSpy.prototype.matching = function (predicate) {
		this.matcher = predicate;
		return this;
	};

	namespace.SignalSpy.prototype.matchingValues = function () {
		var expectedArgs = arguments;
		this.matcher = function () {
			for (var i = 0; i < expectedArgs.length; i++) {
				if (arguments[i] !== expectedArgs[i]) {
					return false;
				}
			}
			return true;
		};
		return this;
	};
})(jasmine.signals);
