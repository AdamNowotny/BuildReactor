/* eslint no-console: 0 */
import Rx from 'rx';
import serviceConfiguration from 'core/config/serviceConfiguration';
import serviceController from 'core/services/serviceController';
import viewConfiguration from 'core/config/viewConfiguration';

const messages = new Rx.Subject();

const init = () => {
	serviceController.events.subscribe(function(event) {
		console.log(new Date().toJSON(), event.source, event.eventName, event.details);
	}, function() {
		console.error(new Date().toJSON(), 'serviceController.events stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'serviceController.events stream completed', arguments);
	});

	serviceController.activeProjects.subscribe(function(state) {
		console.log(new Date().toJSON(), 'serviceController.activeProjects', state);
	}, function() {
		console.error(new Date().toJSON(), 'serviceController.activeProjects stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'serviceController.activeProjects stream completed', arguments);
	});

	serviceConfiguration.changes.subscribe(function(config) {
		console.log(new Date().toJSON(), 'serviceConfiguration.changes', config);
	}, function() {
		console.error(new Date().toJSON(), 'serviceConfiguration.changes stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'serviceConfiguration.changes stream completed', arguments);
	});

	viewConfiguration.changes.subscribe(function(config) {
		console.log(new Date().toJSON(), 'viewConfiguration.changes', config);
	}, function() {
		console.error(new Date().toJSON(), 'viewConfiguration.changes stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'viewConfiguration.changes stream completed', arguments);
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
