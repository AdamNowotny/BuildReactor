/* eslint no-console: 0 */
/* eslint no-alert: 0 */
import core from 'common/core';

const init = ({ debug }) => {
	core.activeProjects.subscribe((state) => {
		if (debug) {
			console.log(new Date().toJSON(), 'core.activeProjects', state);
		}
	}, (...args) => {
		console.error(new Date().toJSON(), 'core.activeProjects stream error', args);
	}, (...args) => {
		console.warn(new Date().toJSON(), 'core.activeProjects stream completed', args);
	});

	core.configurations.subscribe((state) => {
		console.log(new Date().toJSON(), 'core.configurations', state);
	}, (...args) => {
		console.error(new Date().toJSON(), 'core.configurations stream error', args);
	}, (...args) => {
		console.warn(new Date().toJSON(), 'core.configurations stream completed', args);
	});

	core.views.subscribe((state) => {
		console.log(new Date().toJSON(), 'core.views', state);
	}, (...args) => {
		console.error(new Date().toJSON(), 'core.views stream error', args);
	}, (...args) => {
		console.warn(new Date().toJSON(), 'core.views stream completed', args);
	});

	core.messages.subscribe((state) => {
		console.log(new Date().toJSON(), 'core.messages', state);
	}, (...args) => {
		console.error(new Date().toJSON(), 'core.messages stream error', args);
	}, (...args) => {
		console.warn(new Date().toJSON(), 'core.messages stream completed', args);
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
