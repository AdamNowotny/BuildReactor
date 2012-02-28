define(function () {

	function store(settings) {
		var settingsString = JSON.stringify(settings);
		localStorage.setItem('services', settingsString);
		console.log('settingsStore: new settings stored', settings);
	}

	function getAll() {
		var settings;
		if (localStorage.getItem('services') == null) {
			settings = [];
		} else {
			var settingsString = localStorage.getItem('services');
			settings = JSON.parse(settingsString);
		}
		return settings;
	}

	return {
		store: store,
		getAll: getAll
	};
});