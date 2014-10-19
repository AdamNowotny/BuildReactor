define([
	'core/services/serviceController',
	'rx'
], function (serviceController, Rx) {
	'use strict';

	var getByName = function (name) {
		return serviceController.events.where(function (event) {
			return event.eventName === name;
		}).select(function (event) {
			return event;
		});
	};

	return {
		getByName: getByName
	};
});
