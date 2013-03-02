define([
	'main/ajaxRequest',
	'main/serviceController',
	'main/settingsStore',
	'mout/string/interpolate'
], function (AjaxRequest, serviceController, settingsStore, interpolate) {

	'use strict';

	function logger() {
		serviceController.on.reloading.add(function () {
			console.log('serviceController.realoding:   ', settingsStore.getAll());
		});
		serviceController.on.added.add(function (settings) {
			console.log('serviceController.added:       ' + settings.name, settings);
		});
		serviceController.on.updating.add(function (settings) {
			console.log('serviceController.updating:    ' + settings.name);
		});
		serviceController.on.updated.add(function (settings) {
			console.log('serviceController.updated:     ' + settings.name);
		});
		serviceController.on.brokenBuild.add(function (buildEvent) {
			console.log('serviceController.brokenBuild: ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.fixedBuild.add(function (buildEvent) {
			console.log('serviceController.fixedBuild:  ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.startedBuild.add(function (buildEvent) {
			console.log('serviceController.startedBuild: ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.finishedBuild.add(function (buildEvent) {
			console.log('serviceController.finishedBuild:  ' + buildEvent.serviceName, buildEvent);
		});
		serviceController.on.errorThrown.add(function (build) {
			console.error('serviceController.errorThrown:  ' + build.id, build);
		});
		serviceController.on.started.add(function (serviceInfo) {
			console.log('serviceController.started:     ' + serviceInfo.name);
		});
		serviceController.on.startedAll.add(function () {
			console.log('serviceController.startedAll');
		});

		settingsStore.on.storedSettings.add(function (settings) {
			console.log('settingsStore.storedSettings: ', settings);
		});

		window.onerror = function (message, url, line) {
			window.console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	return logger;
});
