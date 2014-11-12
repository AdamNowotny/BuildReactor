define([
	'core/config/version2Updater'
], function (updater) {
	'use strict';
	
	function update() {
		var config = {
			version: localStorage.getItem('version') || 1,
			services: JSON.parse(localStorage.getItem('services')) || []
		};
		var updatedConfig = updater.update(config);
		localStorage.setItem('services', JSON.stringify(updatedConfig.services));
		localStorage.setItem('version', updatedConfig.version);
	}

	function setItem(key, settings) {
		var settingsString = JSON.stringify(settings);
		localStorage.setItem(key, settingsString);
	}

	function getItem(key) {
		var settings;
		if (!localStorage.getItem(key)) {
			settings = [];
		} else {
			var settingsString = localStorage.getItem(key);
			settings = JSON.parse(settingsString);
		}
		return settings;
	}

	return {
		update: update,
		setItem: setItem,
		getItem: getItem
	};
});