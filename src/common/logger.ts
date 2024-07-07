/* eslint-disable no-console */

import events from 'core/events';
import serviceConfiguration from 'core/config/serviceConfiguration';

let LOG_NAMESPACE = 'UNKNOWN';

const init = (options: { prefix: string; enableEvents: boolean }) => {
    LOG_NAMESPACE = options.prefix;

    self.onerror = function (message, url, line) {
        console.error(
            `Unhandled error, message: [${JSON.stringify(message)}], url: [${url}], line: [${line}]`
        );
        return false; // don't suppress default handling
    };

    if (options.enableEvents) logEvents();
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

function logEvents() {
    events.all.subscribe(
        event => {
            console.log(
                new Date().toJSON(),
                'events.all',
                `${event.source}.${event.eventName}`,
                event.details
            );
        },
        (...args) => {
            console.error(new Date().toJSON(), 'events stream error', args);
        },
        (...args) => {
            console.warn(new Date().toJSON(), 'events stream completed', args);
        }
    );

    serviceConfiguration.changes.subscribe(
        config => {
            console.log(new Date().toJSON(), 'serviceConfiguration.changes', config);
        },
        (...args) => {
            console.error(new Date().toJSON(), 'serviceConfiguration.changes stream error', args);
        },
        (...args) => {
            console.warn(
                new Date().toJSON(),
                'serviceConfiguration.changes stream completed',
                args
            );
        }
    );
}
