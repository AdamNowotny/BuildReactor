import 'babel-polyfill';
import Rx from 'rx/dist/rx.testing';

const isEqual = Rx.internals.isEqual;

beforeEach(() => {
    jasmine.addMatchers({
        toHaveEqualElements(util, customEqualityTesters) {
            return {
                compare(actual, ...expected) {
                    return areAllElementsEqual(expected, actual);
                }
            };
        },
        toHaveElements(util, customEqualityTesters) {
            return {
                compare(actual, ...expected) {
                    return hasElements(expected, actual);
                }
            };
        },
        toHaveEvent(util, customEqualityTesters) {
            return {
                compare(actual, eventName) {
                    const count = actual.filter((m) => m.value.value.eventName === eventName).length;
                    return {
                        pass: count > 0
                    };
                }
            };
        }
    });
});

function elementsEqual(expected, actual) {
    const actualValue = actual.value.value;
    const expectedValue = expected.value.value;
    if (typeof expectedValue === 'undefined' && expected.value.kind === 'N') {
        return true;
    }
    if (!(expectedValue instanceof Array) && expectedValue instanceof Object) {
        expected.value.value = Object.assign({}, actualValue, expectedValue);
    }
    return isEqual(expected, actual);
}

function areAllElementsEqual(expected, actual) {
    if (expected.length !== actual.length) {
        return false;
    }
    let result = {
        pass: true
    };
    for (let i = 0; i < expected.length; i++) {
        if (!elementsEqual(expected[i], actual[i])) {
            const actualString = JSON.stringify(actual[i].value.value || actual[i].value.error);
            const expectedString = JSON.stringify(expected[i].value.value || expected[i].value.error);
            result = {
                pass: false,
                message: 'Element not equal.\n' +
                    `Actual  : (@${actual[i].time}) ${actualString},\n` +
                    `Expected: (@${expected[i].time}) ${expectedString}`
            };
        }
    }
    return result;
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
    return {
        pass: found === expected.length
    };
}
