define(['mout/array/remove'], function (remove) {

	'use strict';

	beforeEach(function () {
		this.addMatchers({
			toHaveEqualElements: function () {
				var obs = this.actual;
				var expected = Array.prototype.slice.call(arguments);
				return areElementsEqual(expected, obs);
			},
			toHaveElements: function () {
				var obs = this.actual;
				var expected = Array.prototype.slice.call(arguments);
				return hasElements(expected, obs);
			},
			toHaveElementsAtTimes: function () {
				var obs = this.actual;
				var expectedTimes = Array.prototype.slice.call(arguments);
				var i;
				for (i = 0; i < this.actual.length; i++) {
					if (expectedTimes.indexOf(this.actual[i].time) !== -1) {
						remove(expectedTimes, this.actual[i].time);
					}
				}
				return expectedTimes.length === 0;
			},
			toHaveEvent: function (eventName, expectedTimes) {
				var i, times = 0;
				for (i = 0; i < this.actual.length; i++) {
					if (this.actual[i].value.value.eventName === eventName) {
						times++;
					}
				}
				return expectedTimes ? times === expectedTimes : times > 0;
			},
			toHaveEventBefore: function (time, eventName) {
				var i;
				for (i = 0; i < this.actual.length; i++) {
					var current = this.actual[i];
					if (current.time < time && current.value.value.eventName === eventName) {
						return true;
					}
				}
				return false;
			}
		});
	});

	function defaultComparer(x, y) {
		if (!y.equals) {
			return x === y;
		}
		return x.equals(y);
	}

	function areElementsEqual(expected, actual, comparer) {
		var i;
		if (!comparer) {
			comparer = defaultComparer;
		}
		if (expected.length !== actual.length) {
			return false;
		}
		for (i = 0; i < expected.length; i++) {
			if (!comparer(expected[i], actual[i])) {
				return false;
			}
		}
		return true;
	}

	function hasElements(expected, actual, comparer) {
		var i, j, found = 0;
		if (!comparer) {
			comparer = defaultComparer;
		}
		for (i = 0; i < expected.length; i++) {
			for (j = 0; j < actual.length; j++) {
				if (comparer(expected[i], actual[j])) {
					found++;
				}
			}
		}
		return found === expected.length;
	}

});