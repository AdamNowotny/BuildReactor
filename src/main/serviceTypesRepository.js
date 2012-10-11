define(function () {

	'use strict';
	
	var types = [];

	var getAll = function () {
		return types;
	};

	var register = function (Service) {
		var settings = Service.settings();
		types.push(settings);
	};

	var clear = function () {
		types = [];
	};

	return {
		getAll: getAll,
		register: register,
		clear: clear
	};
});