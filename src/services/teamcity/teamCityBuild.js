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
		// this.isRunning = false;
	};

	var update = function () {
		var completed = new Signal();
		completed.memorize = true;
		var that = this;
		request.build(this.settings, this.id).addOnce(function (result) {
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
			request.buildRunning(that.settings, that.id).addOnce(function (result) {
				if (!that.isRunning && result.response) {
					that.isRunning = true;
					that.on.started.dispatch(that);
				} else if (that.isRunning && result.error && result.error.httpStatus === 404) {
					that.isRunning = false;
					that.on.finished.dispatch(that);
				}
			});
			completed.dispatch();
		});
		return completed;
	};

	TeamcityBuild.prototype = {
		update: update
	};

	return TeamcityBuild;
});