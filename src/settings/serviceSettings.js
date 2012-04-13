define([
		'signals',
		'amdUtils/array/remove'
], function (signals, remove) {

	var settings;

	var cleared = new signals.Signal();

	function load(newSettings) {
		settings = newSettings;
	};

	var clear = function () {
		settings = [];
	};

	var add = function (serviceInfo) {
		settings.push(serviceInfo);
	};

	var getAll = function () {
		return settings;
	};

	var removeService = function (serviceInfo) {
		remove(settings, serviceInfo);
		cleared.dispatch();
	};

	var getByIndex = function(index) {
		return settings[index];
	};
	
	return {
		load: load,
		clear: clear,
		cleared: cleared,
		add: add,
		getAll: getAll,
		remove: removeService,
		getByIndex: getByIndex
	};
});