/* eslint-disable no-console */

let LOG_NAMESPACE = 'LOG';
let debug = false;

const init = (options: { prefix: string; debug?: boolean }) => {
    LOG_NAMESPACE = options.prefix;
    debug = options.debug ?? false;

    self.onerror = function (message, url, line) {
        console.error(
            // prettier-ignore
            `Unhandled error, message: [${JSON.stringify(message)}], url: [${url}], line: [${line}]`,
        );
        return false; // don't suppress default handling
    };
};

const log = (...args) => {
    if (!debug) return;
    console.debug(LOG_NAMESPACE, ...args);
};

const info = (...args) => {
    console.info(LOG_NAMESPACE, ...args);
};

const warn = (...args) => {
    console.warn(LOG_NAMESPACE, ...args);
};

const error = (...args) => {
    console.error(LOG_NAMESPACE, ...args);
};

const group = (label: string) => {
    console.groupCollapsed(label);
    console.time(label);
};

const groupEnd = (label: string) => {
    console.timeEnd(label);
    console.groupEnd();
};

export default {
    init,
    info,
    log,
    warn,
    error,
    group,
    groupEnd,
};
