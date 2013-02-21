define([
	'main/ajaxRequest',
	'main/serviceController',
	'main/settingsStore',
	'mout/string/interpolate'
], function (AjaxRequest, serviceController, settingsStore, interpolate) {

	'use strict';

	function logger() {
		serviceController.on.reloading.add(function () {
			console.log(new Date().toJSON(), 'serviceController.reloading:   ', settingsStore.getAll());
		});
		serviceController.on.added.add(function (settings) {
			console.log(new Date().toJSON(), 'serviceController.added:       ' + settings.name, settings);
		});
		serviceController.on.updating.add(function (settings) {
			console.log(new Date().toJSON(), 'serviceController.updating:    ' + settings.name);
		});
		serviceController.on.updated.add(function (settings) {
			console.log(new Date().toJSON(), 'serviceController.updated:     ' + settings.name);
		});
		serviceController.on.brokenBuild.add(function (buildEvent) {
			console.log(new Date().toJSON(), 'serviceController.brokenBuild: ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.fixedBuild.add(function (buildEvent) {
			console.log(new Date().toJSON(), 'serviceController.fixedBuild:  ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.errorThrown.add(function (build) {
			console.error(new Date().toJSON(), 'serviceController.errorThrown:  ' + build.id, build);
		});
		serviceController.on.started.add(function (serviceInfo) {
			console.log(new Date().toJSON(), 'serviceController.started:     ' + serviceInfo.name);
		});
		serviceController.on.startedAll.add(function () {
			console.log(new Date().toJSON(), 'serviceController.startedAll');
		});

		settingsStore.on.storedSettings.add(function (settings) {
			console.log(new Date().toJSON(), 'settingsStore.storedSettings: ', settings);
		});

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	return logger;
});