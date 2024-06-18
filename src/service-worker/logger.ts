/* eslint-disable no-console */

const log = (...args) => {
    console.log(...args);
};
const warn = (...args) => {
    console.warn(...args);
};

const error = (...args) => {
    console.error(...args);
};

export default {
    log,
    warn,
    error
};
