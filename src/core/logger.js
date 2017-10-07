/* eslint no-console: 0 */
import Rx from 'rx';
import events from 'core/events';
import serviceConfiguration from 'core/config/serviceConfiguration';
import viewConfiguration from 'core/config/viewConfiguration';

const messages = new Rx.Subject();

const init = ({ debug }) => {
	events.all.subscribe((event) => {
		if (debug) {
			console.log(new Date().toJSON(),
				'events.all',
				`${event.source}.${event.eventName}`,
				event.details
			);
		}
	}, (...args) => {
		console.error(new Date().toJSON(), 'events stream error', args);
	}, (...args) => {
		console.warn(new Date().toJSON(), 'events stream completed', args);
	});

	serviceConfiguration.changes.subscribe((config) => {
		console.log(new Date().toJSON(), 'serviceConfiguration.changes', config);
	}, (...args) => {
		console.error(new Date().toJSON(), 'serviceConfiguration.changes stream error', args);
	}, (...args) => {
		console.warn(new Date().toJSON(), 'serviceConfiguration.changes stream completed', args);
	});

	viewConfiguration.changes.subscribe((config) => {
		console.log(new Date().toJSON(), 'viewConfiguration.changes', config);
	}, (...args) => {
		console.error(new Date().toJSON(), 'viewConfiguration.changes stream error', args);
	}, (...args) => {
		console.warn(new Date().toJSON(), 'viewConfiguration.changes stream completed', args);
	});

	messages.subscribe((message) => {
		console.error(message);
	});

	window.onerror = function(message, url, line) {
		window.console.error(`Unhandled error, message: [${message}], url: [${url}], line: [${line}]`);
		messages.onNext({
			name: 'error',
			errorType: 'unhandled',
			message,
			url,
			line
		});
		return false; // don't suppress default handling
	};

};

export default {
	init,
	messages
};
