define([
	'rx',
	'jquery',
	'mout/object/values',
	'mout/object/mixIn',
	'rx.time'
], function (Rx, $, values, mixIn) {
	'use strict';

	function BuildService(settings) {
		this.rx = true;
		this.Build = null;
		this.settings = settings;
		this.updateAll = updateAll;
		this.start = start;
		this.stop = stop;
		this.activeProjects = activeProjects;
		this.events = new Rx.Subject();
		this.builds = {};
		this.latestBuildStates = getInitialStates(settings);
		this.poolingSubscription = null;
		this.mixInMissingState = mixInMissingState;
		this.processBuildUpdate = processBuildUpdate;
	}

	var getInitialStates = function (settings) {
		var self = this;
		var states = {};
		settings.projects.forEach(function (buildId) {
			states[buildId] = createDefaultState(buildId, settings);
		});
		return states;
	};

	var createDefaultState = function (id, settings) {
		return {
			id: id,
			name: id,
			group: null,
			webUrl: null,
			isBroken: false,
			isRunning: false,
			isDisabled: false,
			serviceName: settings.name,
			serviceIcon: settings.icon
		};
	};

	var updateAll = function () {

		var initializeBuilds = function () {
			self.settings.projects.forEach(function (buildId) {
				if (!self.builds[buildId]) {
					self.builds[buildId] = new self.Build(buildId, self.settings);
				}
			});
		};

		var getBuildById = function (buildId) {
			return self.builds[buildId];
		};

		var self = this;
		initializeBuilds();
		return Rx.Observable.fromArray(this.settings.projects)
			.select(getBuildById)
			.selectMany(function (build) {
				return build.update()
					.catchException(function (ex) { 
						return Rx.Observable.returnValue({
							id: build.id,
							error: ex
						});
					});
			}).select(function (state) { return self.mixInMissingState(state); })
			.doAction(function (state) { return self.processBuildUpdate(state); })
			.defaultIfEmpty([]);
	};

	var mixInMissingState = function (state) {
		var defaults = {
			isBroken: this.latestBuildStates[state.id].isBroken,
			isDisabled: false,
			serviceName: this.settings.name,
			serviceIcon: this.settings.icon
		};
		return mixIn(defaults, state);
	};

	var processBuildUpdate = function (newState) {
		if (newState.error) {
			this.events.onNext({ eventName: 'updateError', details: newState });
		}
		var lastState = this.latestBuildStates[newState.id];
		if (!lastState.isBroken && newState.isBroken) {
			this.events.onNext({ eventName: 'buildBroken', details: newState });
		}
		if (lastState.isBroken && !newState.isBroken) {
			this.events.onNext({ eventName: 'buildFixed', details: newState });
		}
		if (!lastState.isRunning && newState.isRunning) {
			this.events.onNext({ eventName: 'buildStarted', details: newState });
		}
		if (lastState.isRunning && !newState.isRunning) {
			this.events.onNext({ eventName: 'buildFinished', details: newState });
		}
		this.latestBuildStates[newState.id] = newState;
	};


	var start = function () {
		if (this.poolingSubscription !== null) { 
			return Rx.Observable.empty();
		}
		var self = this;
		var updateInterval = this.settings.updateInterval * 1000;
		this.poolingSubscription = Rx.Observable.interval(updateInterval)
			.selectMany(function () { return self.updateAll(); })
			.subscribe();
		return self.updateAll()
			.toArray()
			.doAction(function (states) {
				self.events.onNext({ eventName: 'serviceStarted', details: states });
			});
	};

	var stop = function () {
		if (this.poolingSubscription && !this.poolingSubscription.isStopped) {
			this.poolingSubscription.dispose();
			this.poolingSubscription = null;
			this.events.onNext({ eventName: 'serviceStopped' });
		}
	};

	var activeProjects = function () {
		var self = this;
		return {
			name: this.settings.name,
			items: this.settings.projects.map(function (buildId) {
					return self.latestBuildStates[buildId];
				}).filter(function (state) {
					return !state.isDisabled;
				})
		};
	};

	return BuildService;
});