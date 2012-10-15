define(['common/resourceFinder', 'signals'], function (resourceFinder, Signal) {

	'use strict';
	
	var types = [];

	var getAllTypes = function () {
		return types;
	};

	var registerType = function (Service) {
		var settings = Service.settings();
		types.push(settings);
	};

	var clear = function () {
		types = [];
	};

	var create = function (settings) {
		var serviceModuleName = resourceFinder.service(settings);
		require([serviceModuleName], function (BuildService) {
			var service = new BuildService(settings);
			result.dispatch(service);
		});

		var result = new Signal();
		result.memorize = true;
		return result;
	};

	return {
		getAllTypes: getAllTypes,
		registerType: registerType,
		clear: clear,
		create: create
	};
});