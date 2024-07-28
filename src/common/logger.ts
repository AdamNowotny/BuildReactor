/* eslint-disable no-console */

let LOG_NAMESPACE = 'LOG';

const init = (options: { prefix: string }) => {
    LOG_NAMESPACE = options.prefix;

    self.onerror = function (message, url, line) {
        console.error(
            // prettier-ignore
            `Unhandled error, message: [${JSON.stringify(message)}], url: [${url}], line: [${line}]`,
        );
        return false; // don't suppress default handling
    };
};

const debug = (...args) => {
    console.debug(LOG_NAMESPACE, ...args);
};

const log = (...args) => {
    console.log(LOG_NAMESPACE, ...args);
};

const warn = (...args) => {
    console.warn(LOG_NAMESPACE, ...args);
};

const error = (...args) => {
    console.error(LOG_NAMESPACE, ...args);
};

const group = (label: string) => {
    console.group(label);
    console.time(label);
};

const groupEnd = (label: string) => {
    console.groupEnd();
    console.timeEnd(label);
};

export default {
    init,
    debug,
    log,
    warn,
    error,
    group,
    groupEnd,
};
