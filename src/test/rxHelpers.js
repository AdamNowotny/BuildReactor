define([
	'mout/array/remove',
	'mout/object/deepMatches',
	'mout/array/removeAll'
], function (remove, deepMatches, removeAll) {

	'use strict';


	beforeEach(function () {
		this.addMatchers({
			toHaveEqualElements: function () {
				var expected = Array.prototype.slice.call(arguments);
				return areAllElementsEqual(expected, this.actual);
			},
			toHaveElements: function () {
				var expected = Array.prototype.slice.call(arguments);
				return hasElements(expected, this.actual);
			},
			toHaveElementsMatchingAt: function (time, matcher) {
				var i, found = 0;
				for (i = 0; i < this.actual.length; i++) {
					try {
						if (this.actual[i].time === time && matcher(this.actual[i].value.value)) {
							found++;
						}
					} catch (ex) {
						// ignore and check next
					}
				}
				return found > 0;
			},
			toHaveElementsAtTimes: function () {
				var expectedTimes = Array.prototype.slice.call(arguments);
				var actualTimes = this.actual.map(function (value) {
					return value.time;
				});
				removeAll(actualTimes, expectedTimes);
				return actualTimes.length === 0;
			},
			toHaveEvent: function (eventName, expectedCount) {
				var i, times = 0;
				for (i = 0; i < this.actual.length; i++) {
					if (this.actual[i].value.value.eventName === eventName) {
						times++;
					}
				}
				return expectedCount ? times === expectedCount : times > 0;
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

	function elementsEqual(x, y) {
		return x.equals(y) && deepMatches(x.value.value, y.value.value);
	}

	function areAllElementsEqual(expected, actual) {
		var i;
		if (expected.length !== actual.length) {
			return false;
		}
		for (i = 0; i < expected.length; i++) {
			if (!elementsEqual(expected[i], actual[i])) {
				return false;
			}
		}
		return true;
	}

	function hasElements(expected, actual) {
		var i, j, found = 0;
		for (i = 0; i < expected.length; i++) {
			for (j = 0; j < actual.length; j++) {
				if (elementsEqual(expected[i], actual[j])) {
					found++;
				}
			}
		}
		return found === expected.length;
	}

	function hasElementsMatching(actual, matcher) {
		var i, found = 0;
		for (i = 0; i < actual.length; i++) {
			if (matcher(actual[i].value.value)) {
				found++;
			}
		}
		return found > 0;
	}

});