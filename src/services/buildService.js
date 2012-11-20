define([
	'services/PoolingService',
	'signals',
	'jquery',
	'amdUtils/object/values'
], function (PoolingService, Signal, $, values) {
	'use strict';

	function BuildService(settings) {
		$.extend(this, new PoolingService(settings));
		this.name = settings.name;
		this.builds = {};
		$.extend(this.on, {
			errorThrown: new Signal(),
			brokenBuild: new Signal(),
			fixedBuild: new Signal(),
			startedBuild: new Signal(),
			finishedBuild: new Signal()
		});
	}

	var activeProjects = function () {
		var projectsInfo = values(this.builds).map(function (build) {
			return {
				name: build.name,
				group: build.projectName,
				isBroken: build.isBroken,
				url: build.webUrl,
				isBuilding: build.isRunning
			};
		});
		return {
			name: this.name,
			items: projectsInfo
		};
	};

	var observeBuild = function (build) {
		build.on.broken.add(onBuildBroken, this);
		build.on.fixed.add(onBuildFixed, this);
		build.on.started.add(onBuildStarted, this);
		build.on.finished.add(onBuildFinished, this);
		build.on.errorThrown.add(onErrorThrown, this);
	};

	var onErrorThrown = function (errorInfo) {
		this.on.errorThrown.dispatch(errorInfo);
	};

	var createBuildInfo = function (build) {
		var buildInfo = {
			serviceName: this.name,
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
		this.on.fixedBuild.dispatch(build);
	};

	var onBuildStarted = function (build) {
		var info = createBuildInfo.apply(this, [build]);
		this.on.startedBuild.dispatch(build);
	};

	var onBuildFinished = function (build) {
		var info = createBuildInfo.apply(this, [build]);
		this.on.finishedBuild.dispatch(build);
	};

	BuildService.prototype = {
		activeProjects: activeProjects,
		observeBuild: observeBuild
	};

	return BuildService;
});