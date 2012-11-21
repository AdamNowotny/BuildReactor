define([
	'services/build',
	'services/teamcity/teamcityRequest',
	'signals',
	'jquery'
], function (Build, request, Signal, $) {
	'use strict';

	var TeamcityBuild = function (id, settings) {
		$.extend(this, new Build(id));
		this.settings = settings;
	};

	var update = function () {

		var buildResponseHandler = function (result) {
			that.name = result.response.buildType.name;
			that.projectName = result.response.buildType.projectName;
			that.webUrl = result.response.webUrl;
			if (that.isBroken && result.response.status === 'SUCCESS') {
				that.isBroken = false;
				that.on.fixed.dispatch(that);
			}
			if (!that.isBroken && (result.response.status in { 'FAILURE': 1, 'ERROR': 1 })) {
				that.isBroken = true;
				that.on.broken.dispatch(that);
			}
		};

		var buildRunningResponseHandler = function (result) {
			if (result.error) {
				that.on.errorThrown.dispatch(that);
			} else if (!that.isRunning && result.response.running) {
				that.isRunning = true;
				that.on.started.dispatch(that);
			} else if (that.isRunning && !result.response.running) {
				that.isRunning = false;
				that.on.finished.dispatch(that);
			}
		};

		var completed = new Signal();
		completed.memorize = true;
		var that = this;
		request.build(this.settings, this.id).addOnce(function (result) {
			if (result.error) {
				that.on.errorThrown.dispatch(that);
			} else {
				buildResponseHandler(result);
				request.buildRunning(that.settings, that.id).addOnce(buildRunningResponseHandler);
			}
			completed.dispatch();
		});
		return completed;
	};

	TeamcityBuild.prototype = {
		update: update
	};

	return TeamcityBuild;
});