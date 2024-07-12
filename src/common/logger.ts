/* eslint-disable no-console */

let LOG_NAMESPACE = 'undefined';

const init = (options: { prefix: string }) => {
    LOG_NAMESPACE = options.prefix;

    self.onerror = function (message, url, line) {
        console.error(
            `Unhandled error, message: [${JSON.stringify(message)}], url: [${url}], line: [${line}]`
        );
        return false; // don't suppress default handling
    };
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

export default {
    init,
    log,
    warn,
    error,
};
