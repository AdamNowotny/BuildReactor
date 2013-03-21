define([
	'services/build',
	'services/buildbot/buildbotRequest',
	'signals',
	'jquery',
	'common/joinUrl'
], function (Build, request, Signal, $, joinUrl) {
	'use strict';

	var BuildBotBuild = function (id, settings) {
		$.extend(this, new Build(id, settings));
		this.name = id;
	};

	function activateEvents(build, active) {
		build.on.broken.active = active;
		build.on.fixed.active = active;
		build.on.started.active = active;
		build.on.finished.active = active;
	}

	BuildBotBuild.prototype.update = function () {

		var builderResponseHandler = function (result) {
            that.webUrl = joinUrl(that.settings.url, "builders/" + that.id);
			that.projectName = result.response.category;
			activateEvents(that, !that.isDisabled);
			var isBuilding = result.response.state === "building";
			if (!that.isRunning && isBuilding) {
				that.isRunning = true;
				that.on.started.dispatch(that);
			} else if (that.isRunning && !isBuilding) {
				that.isRunning = false;
				that.on.finished.dispatch(that);
			}
			request.lastCompletedBuild(that.settings, that.id).addOnce(function (result) {
				updateResult(that, result);
				completed.dispatch();
			});
		};

		var updateResult = function (build, result) {
			if (result.error) {
				that.on.errorThrown.dispatch(that);
                return;
            }
			if (build.isBroken && result.response.text.indexOf('successful') !== -1) {
				build.isBroken = false;
				build.on.fixed.dispatch(that);
			}
			if (!build.isBroken && result.response.text.indexOf('failed') !== -1) {
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
		request.builder(this.settings, this.id).addOnce(function (result) {
			if (result.error) {
				that.on.errorThrown.dispatch(that);
				completed.dispatch();
			} else {
				builderResponseHandler(result);
			}
		});
		return completed;
	};

	return BuildBotBuild;
});
