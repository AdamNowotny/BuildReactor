define([
	'main/ajaxRequest',
	'main/serviceController',
	'main/settingsStore',
	'amdUtils/string/interpolate',
	'has'
], function (AjaxRequest, serviceController, settingsStore, interpolate, has) {

	'use strict';

	function logger() {
		serviceController.on.reset.add(function (service) {
			console.log('serviceController.reset:      ', settingsStore.getAll());
		});
		serviceController.on.added.add(function (service) {
			console.log('serviceController.added:       ' + service.name, service.settings);
		});
		serviceController.on.updating.add(function (serviceInfo) {
			console.log('serviceController.updating:    ' + serviceInfo.serviceName);
		});
		serviceController.on.updated.add(function (serviceInfo) {
			console.log('serviceController.updated:     ' + serviceInfo.serviceName);
		});
		serviceController.on.brokenBuild.add(function (buildEvent) {
			console.log('serviceController.brokenBuild: ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.fixedBuild.add(function (buildEvent) {
			console.log('serviceController.fixedBuild:  ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.errorThrown.add(function (errorInfo) {
			console.error(interpolate('serviceController.errorThrown:  {{0}} [{{1}}]', [ errorInfo.serviceName, errorInfo.message]), errorInfo);
		});
		serviceController.on.started.add(function (serviceInfo) {
			console.log('serviceController.started:     ' + serviceInfo.serviceName);
		});
		serviceController.on.startedAll.add(function () {
			console.log('serviceController.startedAll');
		});

		settingsStore.on.storedSettings.add(function (settings) {
			console.log('settingsStore.storedSettings: ', settings);
		});

		if (has('debug')) {
			AjaxRequest.prototype.all.responseReceived.add(function (response) {
				console.log('AjaxRequest.responseReceived: ', response);
			});
			AjaxRequest.prototype.all.errorReceived.add(function (errorInfo) {
				console.log('AjaxRequest.errorReceived: ', errorInfo);
			});
		}

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	return logger;
});