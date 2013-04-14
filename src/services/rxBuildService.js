define([
	'rx',
	'jquery',
	'mout/object/values',
	'rx.time',
	'rx.experimental'
], function (Rx, $, values) {
	'use strict';

	var rxPoolingSubscription;

	function BuildService(settings) {
		this.rx = true;
		this.Build = Build;
		this.settings = settings;
		this.builds = {};
		this.updateAll = updateAll;
		this.start = start;
		this.stop = stop;
		this.activeProjects = activeProjects;
	}

	var Build = function (id, settings) {
		this.state = null;
		this.update = function () {};
	};

	var updateAll = function () {
		var getBuild = function (buildId) {
			var build = self.builds[buildId];
			if (!build) {
				build = new self.Build(buildId, self.settings);
				self.builds[buildId] = build;
			}
			return build;
		};

		var self = this;
		var rxBuildUpdate = this.settings.projects.map(function (buildId) {
			return getBuild(buildId).update();
		});
		return Rx.Observable.forkJoin(rxBuildUpdate);
	};

	var start = function () {
		var self = this;
		var rxPoolingSubscription = Rx.Observable.interval(5000).selectMany(function () {
				return self.updateAll();
			}).subscribe(updateAllSucceeded, updateAllFailed);
		var rxInitUpdate = this.updateAll();
		rxInitUpdate.subscribe(updateAllSucceeded, updateAllFailed);
		return rxInitUpdate;
	};

	var updateAllSucceeded = function (a) {
		console.warn("ok", a);
	};
	
	var updateAllFailed = function (a) {
		console.warn("error", a);
	};

	function stop() {
		rxPoolingSubscription.dispose();
	}

	var activeProjects = function () {
		var buildsInfo = values(this.builds).filter(function (build) {
			return !build.isDisabled;
		}).map(function (build) {
			return build.state;
		});
		return {
			name: this.settings.name,
			items: buildsInfo
		};
	};

	return BuildService;
});