(function (global) {

	var spies = [];

	jasmine.signals = {};

	/*
	* Spies definitions
	*/

	jasmine.signals.spyOnSignal = function (signal, matcher) {
		var spy = new jasmine.signals.SignalSpy(signal, matcher);
		spies.push(spy);
		return spy;
	};

	jasmine.signals.spyOnSignal.spyOnSignal = jasmine.signals.spyOnSignal;
	
	/*
	* Matchers
	*/

	function actualToString(spy) {
		return spy.dispatches.map(function (d) {
			return '(' + d + ')';
		}).join('');
	}

	jasmine.signals.matchers = {
		toHaveBeenDispatched: function (expectedCount) {
			this.message = function() {
				var not = this.isNot ? ' not' : '';
				var message = 'Expected ' + spy.signal.toString() + not + ' to have been dispatched';
				if (expectedCount > 0) {
					message += ' ' + expectedCount + ' times but was ' + spy.count;
				}
				if (this.actual.expectedArgs !== undefined) {
					message += ' with (' + spy.expectedArgs.join(',') + ')';
					message += ' but was with ' + actualToString(spy);
				}
				return message;
			};

			var spy = getSpy(this.actual);
			if (!(spy instanceof jasmine.signals.SignalSpy)) {
				throw new Error('Expected a SignalSpy');
			}
			return (expectedCount === undefined) ?
				!!(spy.count) :
				spy.count === expectedCount;
		},
		toHaveBeenDispatchedWith: function () {
			this.message = function() {
				var not = this.isNot ? ' not' : '';
				var message = 'Expected ' + spy.signal.toString() + not + ' to have been dispatched';
				if (params || spy.expectedArgs !== undefined) {
					var args = params || [];
					message += ' with (' + args.join(',') + ')';
					message += ' but was with ' + actualToString(spy);
				}
				return message;
			};

			var spy = getSpy(this.actual);
			if (!(spy instanceof jasmine.signals.SignalSpy)) {
				throw new Error('Expected a SignalSpy');
			}
			var params = Array.prototype.slice.call(arguments);
			return spy.dispatches.filter(spy.signalMatcher).map(function (d) {
				return (paramsMatch(d, params)) ? !this.isNot : false;
			}).reduce(function (a, b) {
				return a || b;
			}, false);
		}
	};

	function paramsMatch(p1, p2) {
		for (var i = p1.length - 1; i >= 0; i--) {
			if (p1[i] !== p2[i]) {
				return false;
			}
		}
		return true;
	}

	function getSpy(actual) {
		if (actual instanceof signals.Signal) {
			return spies.filter(function spiesForSignal(d) {
				return d.signal === actual;
			})[0];
		}
		return actual;
	}

	/*
	* Spy implementation
	*/

	(function (namespace) {
		namespace.SignalSpy = function (signal, matcher) {
			if (!(signal instanceof signals.Signal)) {
				throw 'spyOnSignal requires a signal as a parameter';
			}
			this.signal = signal;
			this.signalMatcher = matcher || allSignalsMatcher;
			this.count = 0;
			this.dispatches = [];
			this.initialize();
		};

		function allSignalsMatcher() {
			return true;
		}

		namespace.SignalSpy.prototype.initialize = function () {
			this.signal.add(onSignal, this);
		};

		function onSignal() {
			var paramArray = (arguments.length) ? Array.prototype.slice.call(arguments) : [];
			this.dispatches.push(paramArray);
			if (this.signalMatcher.apply(this, Array.prototype.slice.call(arguments))) {
				this.count++;
			}
		}

		namespace.SignalSpy.prototype.stop = function () {
			this.signal.remove(onSignal, this);
		};

		namespace.SignalSpy.prototype.matching = function (predicate) {
			this.signalMatcher = predicate;
			return this;
		};

		// backward compatibility, deprecated: split your tests
		namespace.SignalSpy.prototype.reset = function () {
			this.count = 0;
			return this;
		};

		// obsolete: use expect(...).haveBeenDispatchedWith(...)
		namespace.SignalSpy.prototype.matchingValues = function () {
			this.expectedArgs = Array.prototype.slice.call(arguments);
			this.signalMatcher = function () {
				return paramsMatch(this.expectedArgs, arguments);
			};
			return this;
		};
	})(jasmine.signals);

	beforeEach(function () {
		this.addMatchers(jasmine.signals.matchers);
	});

	afterEach(function () {
		spies.forEach(function (d) {
			d.stop();
		});
		spies = [];
	});

	// exports to multiple environments
	if (typeof define === 'function' && define.amd) { // AMD
		define(['signals'], function (amdSignals) {
			signals = amdSignals;
			return jasmine.signals.spyOnSignal;
		});
	} else if (typeof module !== 'undefined' && module.exports) { // node
		module.exports = jasmine.signals.spyOnSignal;
	} else { // browser
		// use string because of Google closure compiler ADVANCED_MODE
		global['spyOnSignal'] = jasmine.signals.spyOnSignal;
		signals = global['signals'];
	}

} (this));
