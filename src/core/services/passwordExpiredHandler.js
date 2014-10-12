define([
	'core/services/serviceController',
	'core/services/serviceConfiguration'
], function (serviceController, serviceConfiguration) {

	'use strict';

	serviceController.events.where(function (event) {
		return event.eventName === 'passwordExpired';
	}).doAction(function (event) {
		serviceConfiguration.disableService(event.source);
	}).subscribe();
});