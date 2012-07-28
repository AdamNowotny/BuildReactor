define([
	'AjaxRequest',
	'serviceController',
	'settingsStore',
	'amdUtils/string/interpolate'
], function (AjaxRequest, serviceController, settingsStore, interpolate) {

	'use strict';

	function logger() {
		serviceController.on.added.add(function (service) {
			console.log('Service added: ' + service.name, service.settings);
		});
		serviceController.on.updating.add(function (serviceInfo) {
			console.log(serviceInfo.serviceName + ': update started');
		});
		serviceController.on.updated.add(function (serviceInfo) {
			console.log(serviceInfo.serviceName + ': update finished');
		});
		serviceController.on.brokenBuild.add(function (buildEvent) {
			console.log(buildEvent.serviceName + ': build failed', buildEvent);
		});
		serviceController.on.fixedBuild.add(function (buildEvent) {
			console.log(buildEvent.serviceName + ': build fixed', buildEvent);
		});
		serviceController.on.errorThrown.add(function (errorInfo) {
			console.error(errorInfo.serviceName + ': ' + errorInfo.message, errorInfo);
		});
		serviceController.on.started.add(function (serviceInfo) {
			console.log('Service started: ' + serviceInfo.serviceName);
		});

		settingsStore.on.storedSettings.add(function (settings) {
			console.log('settingsStore: New settings', settings);
		});

		AjaxRequest.prototype.on.responseReceived.add(function (response) {
			console.log('Ajax response received: ', response);
		});
		AjaxRequest.prototype.on.errorReceived.add(function (errorInfo) {
			console.log('Error response:', errorInfo);
		});

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	return logger;
});