define([
	'rx',
	'jquery',
	'mout/object/values',
	'mout/object/mixIn',
	'rx.time',
	'rx.experimental'
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
			name: null,
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

		var fillInState = function (state) {
			var defaults = {
				isDisabled: false,
				serviceName: self.settings.name,
				serviceIcon: self.settings.icon
			};
			return mixIn(defaults, state);
		};

		var processBuildUpdate = function (newState) {
			var oldState = self.latestBuildStates[newState.id];
			if (!oldState.isBroken && newState.isBroken) {
				self.events.onNext({ eventName: 'buildBroken', details: newState });
			}
			if (oldState.isBroken && !newState.isBroken) {
				self.events.onNext({ eventName: 'buildFixed', details: newState });
			}
			if (!oldState.isRunning && newState.isRunning) {
				self.events.onNext({ eventName: 'buildStarted', details: newState });
			}
			if (oldState.isRunning && !newState.isRunning) {
				self.events.onNext({ eventName: 'buildFinished', details: newState });
			}
			self.latestBuildStates[newState.id] = newState;
		};

		var self = this;
		initializeBuilds();
		return Rx.Observable.fromArray(this.settings.projects)
			.select(getBuildById)
			.selectMany(function (build) {
				return build.update();
			}).select(fillInState)
			.doAction(processBuildUpdate)
			.defaultIfEmpty([]);
	};

	var poolingSubscription = null;

	var start = function () {
		if (poolingSubscription !== null) { 
			return Rx.Observable.empty();
		}
		var self = this;
		var updateInterval = this.settings.updateInterval * 1000;
		poolingSubscription = Rx.Observable.interval(updateInterval)
			.selectMany(function () { return self.updateAll(); })
			.subscribe();
		return self.updateAll()
			.toArray()
			.doAction(function (states) {
				self.events.onNext({ eventName: 'serviceStarted', details: states });
			});
	};

	var stop = function () {
		if (poolingSubscription && !poolingSubscription.isStopped) {
			poolingSubscription.dispose();
			poolingSubscription = null;
			this.events.onNext({ eventName: 'serviceStopped' });
		}
	};

// var a = Rx.Observable.range(0, 3)
//.doAction(function (a) { if(a === 1) throw {}})
//.onErrorResumeNext(Rx.Observable.returnValue(1000))
//.subscribe(function (a) { console.log(a)}, function (a) { console.error( a) }, function (a) { console.warn('completed', a)})
	
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