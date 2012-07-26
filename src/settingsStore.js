define(['signals'], function (signals) {

	'use strict';
	
	var on = {
		storedSettings: new signals.Signal()
	};

	function store(settings) {
		var settingsString = JSON.stringify(settings);
		localStorage.setItem('services', settingsString);
		on.storedSettings.dispatch(settings);
	}

	function getAll() {
		var settings;
		if (!localStorage.getItem('services')) {
			settings = [];
		} else {
			var settingsString = localStorage.getItem('services');
			settings = JSON.parse(settingsString);
		}
		return settings;
	}

	return {
		store: store,
		on: on,
		getAll: getAll
	};
});