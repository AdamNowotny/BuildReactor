define([
	'rx',
	'jquery',
	'mout/object/values',
	'mout/object/mixIn',
	'rx.time',
	'rx.binding'
], function (Rx, $, values, mixIn) {
	'use strict';

	function BuildServiceBase(settings) {
		this.Build = null;
		this.settings = settings;
		this.updateAll = updateAll;
		this.start = start;
		this.stop = stop;
		this.events = new Rx.Subject();
		this.builds = {};
		this.latestBuildStates = getInitialStates(settings);
		this.poolingSubscription = null;
		this.mixInMissingState = mixInMissingState;
		this.processBuildUpdate = processBuildUpdate;
		this.activeProjects = new Rx.BehaviorSubject(createState(this));
	}

	var getInitialStates = function (settings) {

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

		var states = {};
		settings.projects.forEach(function (buildId) {
			states[buildId] = createDefaultState(buildId, settings);
		});
		return states;
	};


	var updateAll = function () {

		var initializeBuilds = function () {
			self.settings.projects.forEach(function (buildId) {
				if (!self.builds[buildId]) {
					self.builds[buildId] = new self.Build(buildId, self.settings);
				}
			});
		};

		var self = this;
		initializeBuilds();
		return Rx.Observable.fromArray(this.settings.projects)
			.select(function getBuildById(buildId) {
				return self.builds[buildId];
			}).selectMany(function updateBuild(build) {
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
			this.events.onNext({ eventName: 'updateFailed', details: newState });
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
		this.eventsSubscription = this.events.subscribe(function (event) {
			var state = createState(self);
			self.activeProjects.onNext(state);
		});
		this.poolingSubscription = Rx.Observable.interval(updateInterval)
			.selectMany(function () { return self.updateAll(); })
			.subscribe();
		return self.updateAll()
			.toArray()
			.doAction(function (states) {
				self.events.onNext({
					eventName: 'serviceStarted',
					source: self.settings.name,
					details: states
				});
			});
	};

	var stop = function () {
		if (this.poolingSubscription && !this.poolingSubscription.isStopped) {
			this.poolingSubscription.dispose();
			this.poolingSubscription = null;
			this.events.onNext({ eventName: 'serviceStopped' });
		}
		if (this.eventsSubscription) {
			this.eventsSubscription.dispose();
			this.eventsSubscription = null;
		}
	};

	var createState = function (self) {
		return {
			name: self.settings.name,
			items: self.settings.projects.map(function (buildId) {
					return self.latestBuildStates[buildId];
				})
		};
	};
	
	return BuildServiceBase;
});