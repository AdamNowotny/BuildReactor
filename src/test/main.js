/* eslint no-console: 0 */
import 'angular';
import 'angular-mocks';
import Rx from 'rx';

Rx.config.longStackSupport = true;

window.chrome = {
    browserAction: {
        setBadgeText: () => {},
        setBadgeBackgroundColor: () => {}
    },
    tabs: {
        create: () => {},
        query: (queryInfo, callback) => {}
    },
    runtime: {
        sendMessage: () => {},
        onMessage: {
            addListener: () => {}
        },
        connect: () => ({
                onMessage: {
                    addListener: () => {}
                }
            }),
        onConnect: {
            addListener: () => {}
        }
    },
    extension: {
        sendMessage: () => {},
        onMessage: {
            addListener: () => {}
        },
        onConnect: {
            addListener: () => {}
        },
        connect: () => {},
        getURL: (path) => path
    },
    cookies: {
        remove: () => {}
    },
    notifications: {
        onClicked: {
            addListener: () => {}
        },
        onClosed: {
            addListener: () => {}
        },
        create: () => {},
        clear: () => {}
    }
};

console.warn('New test run ----------------------------------------');

const testsContext = require.context("..", true, /.spec.js$/);
testsContext.keys().forEach(testsContext);
