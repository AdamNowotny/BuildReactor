define([
		'jquery',
		'signals',
		'cctray/buildService',
		'timer',
		'amdUtils/string/interpolate',
		'amdUtils/array/contains'
	], function ($, signals, CCTrayBuildService, Timer, interpolate, contains) {

		'use strict';

		var JenkinsBuildService = function (settings) {
			this.settings = settings;
			this.name = settings.name;
			this.on = {
				errorThrown: new signals.Signal(),
				updating: new signals.Signal(),
				updated: new signals.Signal(),
				brokenBuild: new signals.Signal(),
				fixedBuild: new signals.Signal()
			};
			this._cctrayService = initCCTrayService(settings);
			this._cctrayService.on.brokenBuild.add(function (buildInfo) {
				var buildEvent = {
					serviceName: this.name,
					buildName: buildInfo.buildName,
					group: buildInfo.group,
					url: buildInfo.url,
					icon: this.settings.icon
				};
				this.on.brokenBuild.dispatch(buildEvent);
			}, this);
			this._cctrayService.on.fixedBuild.add(function (buildInfo) {
				var buildEvent = {
					serviceName: this.name,
					buildName: buildInfo.buildName,
					group: buildInfo.group,
					url: buildInfo.url,
					icon: this.settings.icon
				};
				this.on.fixedBuild.dispatch(buildEvent);
			}, this);
			this._cctrayService.on.updating.add(function () {
				this.on.updating.dispatch();
			}, this);
			this._cctrayService.on.updated.add(function () {
				this.on.updated.dispatch();
			}, this);
			this._cctrayService.on.errorThrown.add(function () {
				this.on.errorThrown.dispatch();
			}, this);
		};

		function initCCTrayService(settings) {
			var cctraySettings = CCTrayBuildService.settings();
			cctraySettings.name = settings.name;
			cctraySettings.url = settings.url + 'cc.xml';
			cctraySettings.updateInterval = settings.updateInterval;
			cctraySettings.projects = settings.projects;
			return new CCTrayBuildService(cctraySettings);
		}

		JenkinsBuildService.settings = function () {
			return {
				typeName: 'Jenkins',
				baseUrl: 'jenkins',
				icon: 'jenkins/icon.png',
				projects: []
			};
		};

		JenkinsBuildService.prototype.projects = function (selectedPlans) {
			return this._cctrayService.projects(selectedPlans);
		};

		JenkinsBuildService.prototype.start = function () {
			this._cctrayService.start();
		};

		JenkinsBuildService.prototype.stop = function () {
			this._cctrayService.stop();
		};

		JenkinsBuildService.prototype.update = function () {
			this._cctrayService.update();
		};


		return JenkinsBuildService;
	});