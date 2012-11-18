define(['services/PoolingService', 'signals', 'jquery'], function (PoolingService, Signal, $) {
	'use strict';

	function BuildService(settings) {
		$.extend(this, new PoolingService(settings));
		this.name = settings.name;
		$.extend(this.on, {
			errorThrown: new Signal(),
			brokenBuild: new Signal(),
			fixedBuild: new Signal(),
			startedBuild: new Signal(),
			finishedBuild: new Signal()
		});
	}

	var onBuildFailed = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
			icon: this.settings.icon
		};
		this.on.brokenBuild.dispatch(buildEvent);
	};

	var onBuildFixed = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
			icon: this.settings.icon
		};
		this.on.fixedBuild.dispatch(buildEvent);
	};

	var onBuildStarted = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
			icon: this.settings.icon
		};
		this.on.startedBuild.dispatch(buildEvent);
	};

	var onBuildFinished = function (project) {
		var buildEvent = {
			serviceName: this.name,
			buildName: project.projectName(),
			group: project.category(),
			url: project.url(),
			icon: this.settings.icon
		};
		this.on.finishedBuild.dispatch(buildEvent);
	};

	BuildService.prototype = {
		onBuildFailed: onBuildFailed,
		onBuildFixed: onBuildFixed,
		onBuildStarted: onBuildStarted,
		onBuildFinished: onBuildFinished
	};

	return BuildService;
});