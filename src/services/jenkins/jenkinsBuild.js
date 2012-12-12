define([
	'services/build',
	'services/jenkins/jenkinsRequest',
	'signals',
	'jquery'
], function (Build, request, Signal, $) {
	'use strict';

	var JenkinsBuild = function (id, settings) {
		$.extend(this, new Build(id, settings));
		this.name = id;
		this.projectName = null;
	};

	var failureStates = { 'FAILURE': 1, 'UNSTABLE': 1, 'ABORTED': 1, 'NOT_BUILT': 1 };

	JenkinsBuild.prototype.update = function () {

		var lastBuildResponseHandler = function (result) {
			that.webUrl = result.response.url;
			if (!that.isRunning && result.response.building) {
				that.isRunning = true;
				that.on.started.dispatch(that);
			} else if (that.isRunning && !result.response.building) {
				that.isRunning = false;
				that.on.finished.dispatch(that);
			}
			if (!result.response.result) {
				request.lastCompletedBuild(that.settings, that.id).addOnce(function (result) {
					updateResult(that, result.response.result);
					completed.dispatch();
				});
			} else {
				updateResult(that, result.response.result);
				completed.dispatch();
			}
		};

		var updateResult = function (build, result) {
			if (build.isBroken && result === 'SUCCESS') {
				build.isBroken = false;
				build.on.fixed.dispatch(that);
			}
			if (!build.isBroken && (result in failureStates)) {
				build.isBroken = true;
				build.on.broken.dispatch(that);
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
		request.lastBuild(this.settings, this.id).addOnce(function (result) {
			if (result.error) {
				that.on.errorThrown.dispatch(that);
				completed.dispatch();
			} else {
				lastBuildResponseHandler(result);
			}
		});
		return completed;
	};

	return JenkinsBuild;
});