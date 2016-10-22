define([
	'mout/object/deepMatches',
	'mout/array/removeAll',
	'mout/object/mixIn'
], function(deepMatches, removeAll, mixIn) {

	'use strict';

	beforeEach(function() {
		jasmine.addMatchers({

			toHaveEqualElements: function(util, customEqualityTesters) {
				return {
					compare(actual, ...expected) {
						return { pass: areAllElementsEqual(expected, actual) };
					}
				};
			},
			toHaveElements: function(util, customEqualityTesters) {
				return {
					compare(actual, ...expected) {
						return { pass: hasElements(expected, actual) };
					}
				};
			},
			toHaveEvent: function(util, customEqualityTesters) {
				return {
					compare(actual, eventName) {
						const count = actual.filter((m) => m.value.value.eventName === eventName).length;
						return { pass: count > 0 };
					}
				};
			}
		});
	});

	function elementsEqual(expected, actual) {
		if (expected.time !== actual.time
			|| expected.value.kind !== actual.value.kind) {
			return false;
		}
		const expectedFull = mixIn({}, actual.value.value, expected.value.value);
		return deepMatches(expectedFull, actual.value.value);
	}

	function areAllElementsEqual(expected, actual) {
		if (expected.length !== actual.length) {
			return false;
		}
		for (let i = 0; i < expected.length; i++) {
			if (!elementsEqual(expected[i], actual[i])) {
				return false;
			}
		}
		return true;
	}

	function hasElements(expected, actual) {
		let found = 0;
		for (let i = 0; i < expected.length; i++) {
			for (let j = 0; j < actual.length; j++) {
				if (elementsEqual(expected[i], actual[j])) {
					found++;
				}
			}
		}
		return found === expected.length;
	}

});
