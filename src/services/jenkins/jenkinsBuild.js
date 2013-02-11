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

	function activateEvents(build, active) {
		build.on.broken.active = active;
		build.on.fixed.active = active;
		build.on.started.active = active;
		build.on.finished.active = active;
	}

	JenkinsBuild.prototype.update = function () {

		var jobResponseHandler = function (result) {
			that.webUrl = result.response.lastBuild.url;
			that.isDisabled = !result.response.buildable;
			activateEvents(that, !that.isDisabled);
			var isBuilding = (result.response.lastBuild.number !== result.response.lastCompletedBuild.number);
			if (!that.isRunning && isBuilding) {
				that.isRunning = true;
				that.on.started.dispatch(that);
			} else if (that.isRunning && !isBuilding) {
				that.isRunning = false;
				that.on.finished.dispatch(that);
			}
			request.lastCompletedBuild(that.settings, that.id).addOnce(function (result) {
				updateResult(that, result.response.result);
				completed.dispatch();
			});
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
		request.job(this.settings, this.id).addOnce(function (result) {
			if (result.error) {
				that.on.errorThrown.dispatch(that);
				completed.dispatch();
			} else {
				jobResponseHandler(result);
			}
		});
		return completed;
	};

	return JenkinsBuild;
});