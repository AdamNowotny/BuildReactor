/* eslint no-console: 0 */
/* eslint no-alert: 0 */
import core from 'common/core';

const init = function() {
	core.activeProjects.subscribe(function(state) {
		console.log(new Date().toJSON(), 'core.activeProjects', state);
	}, function() {
		console.error(new Date().toJSON(), 'core.activeProjects stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'core.activeProjects stream completed', arguments);
	});

	core.configurations.subscribe(function(state) {
		console.log(new Date().toJSON(), 'core.configurations', state);
	}, function() {
		console.error(new Date().toJSON(), 'core.configurations stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'core.configurations stream completed', arguments);
	});

	core.views.subscribe(function(state) {
		console.log(new Date().toJSON(), 'core.views', state);
	}, function() {
		console.error(new Date().toJSON(), 'core.views stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'core.views stream completed', arguments);
	});

	core.messages.subscribe(function(state) {
		console.log(new Date().toJSON(), 'core.messages', state);
	}, function() {
		console.error(new Date().toJSON(), 'core.messages stream error', arguments);
	}, function() {
		console.warn(new Date().toJSON(), 'core.messages stream completed', arguments);
	});

	window.onerror = function(message, url, line) {
		const displayMessage = `Unhandled error. message=[${message}], url=[${url}], line=[${line}]`;
		window.console.error(displayMessage);

		alert(displayMessage);
		return false; // don't suppress default handling
	};
};

export default {
	init
};
