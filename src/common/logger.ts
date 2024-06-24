/* eslint-disable no-console */

import events from "core/events";
import serviceConfiguration from "core/config/serviceConfiguration";
import viewConfiguration from "core/config/viewConfiguration";

let LOG_NAMESPACE = "NONE";

const init = (options: { prefix: string }) => {
    LOG_NAMESPACE = options.prefix;

    window.onerror = function (message, url, line) {
        window.console.error(
            `Unhandled error, message: [${message}], url: [${url}], line: [${line}]`
        );
        return false; // don't suppress default handling
    };

    logEvents();
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
        (event) => {
            console.log(
                new Date().toJSON(),
                "events.all",
                `${event.source}.${event.eventName}`,
                event.details
            );
        },
        (...args) => {
            console.error(new Date().toJSON(), "events stream error", args);
        },
        (...args) => {
            console.warn(new Date().toJSON(), "events stream completed", args);
        }
    );

    serviceConfiguration.changes.subscribe(
        (config) => {
            console.log(
                new Date().toJSON(),
                "serviceConfiguration.changes",
                config
            );
        },
        (...args) => {
            console.error(
                new Date().toJSON(),
                "serviceConfiguration.changes stream error",
                args
            );
        },
        (...args) => {
            console.warn(
                new Date().toJSON(),
                "serviceConfiguration.changes stream completed",
                args
            );
        }
    );

    viewConfiguration.changes.subscribe(
        (config) => {
            console.log(
                new Date().toJSON(),
                "viewConfiguration.changes",
                config
            );
        },
        (...args) => {
            console.error(
                new Date().toJSON(),
                "viewConfiguration.changes stream error",
                args
            );
        },
        (...args) => {
            console.warn(
                new Date().toJSON(),
                "viewConfiguration.changes stream completed",
                args
            );
        }
    );
}
