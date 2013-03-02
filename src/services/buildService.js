define([
	'services/build',
	'services/poolingService',
	'signals',
	'jquery',
	'mout/object/values'
], function (Build, PoolingService, Signal, $, values) {
	'use strict';

	function BuildService(settings) {
		$.extend(this, new PoolingService(settings));
		this.settings = settings;
		this.builds = {};
		$.extend(this.on, {
			errorThrown: new Signal(),
			brokenBuild: new Signal(),
			fixedBuild: new Signal(),
			startedBuild: new Signal(),
			finishedBuild: new Signal()
		});
		this.Build = Build;
	}

	var activeProjects = function () {
		var projectsInfo = values(this.builds).filter(function (build) {
			return !build.isDisabled;
		}).map(function (build) {
			return {
				name: build.name,
				group: build.projectName,
				isBroken: build.isBroken,
				url: build.webUrl,
				isBuilding: build.isRunning
			};
		});
		return {
			name: this.settings.name,
			items: projectsInfo
		};
	};

	var updateAll = function () {
		
		function buildUpdateCompleted() {
			remaining--;
			if (remaining === 0) {
				completed.dispatch();
			}
		}

		var self = this;
		var completed = new Signal();
		completed.memorize = true;
		var remaining = this.settings.projects ? this.settings.projects.length : 0;
		if (remaining === 0) {
			completed.dispatch();
		} else {
			this.settings.projects.forEach(function (buildId) {
				if (!self.builds.hasOwnProperty(buildId)) {
					var build = new self.Build(buildId, self.settings);
					self.builds[buildId] = build;
					self.observeBuild(build);
				}
				self.builds[buildId].update().addOnce(buildUpdateCompleted, this);
			});
		}
		return completed;
	};

	var observeBuild = function (build) {
		build.on.broken.add(onBuildBroken, this);
		build.on.fixed.add(onBuildFixed, this);
		build.on.started.add(onBuildStarted, this);
		build.on.finished.add(onBuildFinished, this);
		build.on.errorThrown.add(onErrorThrown, this);
	};

	var onErrorThrown = function (build) {
		this.on.errorThrown.dispatch(build);
	};

	var createBuildInfo = function (build) {
		var buildInfo = {
			serviceName: this.settings.name,
			buildName: build.name,
			group: build.projectName,
			url: build.webUrl,
			icon: this.settings.icon
		};
		return buildInfo;
	};

	var onBuildBroken = function (build) {
		var info = createBuildInfo.apply(this, [build]);
		this.on.brokenBuild.dispatch(info);
	};

	var onBuildFixed = function (build) {
		var info = createBuildInfo.apply(this, [build]);
		this.on.fixedBuild.dispatch(info);
	};

	var onBuildStarted = function (build) {
		var info = createBuildInfo.apply(this, [build]);
		this.on.startedBuild.dispatch(info);
	};

	var onBuildFinished = function (build) {
		var info = createBuildInfo.apply(this, [build]);
		this.on.finishedBuild.dispatch(info);
	};

	BuildService.prototype = {
		activeProjects: activeProjects,
		observeBuild: observeBuild,
		updateAll: updateAll
	};

	return BuildService;
});
