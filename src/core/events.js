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

	var publish = function (event) {
		serviceController.events.onNext(event);
	};

	return {
		getByName: getByName,
		publish: publish
	};
});
