define([
		'signals',
		'amdUtils/array/remove'
], function (signals, remove) {

	var settingsList;

	var cleared = new signals.Signal();

	function load(allSettings) {
		if (Object.prototype.toString.call(allSettings) !== '[object Array]') {
			throw { name: 'ArgumentInvalid', message: 'Expected array of settings' };
		}
		settingsList = allSettings;
	};

	var clear = function () {
		settingsList = [];
	};

	var add = function (serviceInfo) {
		settingsList.push(serviceInfo);
	};

	var getAll = function () {
		return settingsList;
	};

	var removeService = function (serviceInfo) {
		remove(settingsList, serviceInfo);
		cleared.dispatch();
	};

	var getByIndex = function (index) {
		return settingsList[index];
	};

	var update = function (current, newSettings) {
		var index = settingsList.indexOf(current);
		settingsList[index] = newSettings;
	};

	return {
		load: load,
		clear: clear,
		cleared: cleared,
		add: add,
		getAll: getAll,
		remove: removeService,
		getByIndex: getByIndex,
		update: update
	};
});