define([], function() {
	'use strict';
	
	function setItem(key, settings) {
		var settingsString = JSON.stringify(settings);
		localStorage.setItem(key, settingsString);
	}

	function getItem(key) {
		var settings;
		if (localStorage.getItem(key)) {
			var settingsString = localStorage.getItem(key);
			settings = JSON.parse(settingsString);
		}
		return settings;
	}

	return {
		setItem: setItem,
		getItem: getItem
	};
});
