define([
	'rx',
	'mout/object/mixIn',
	'rx.time',
	'rx.binding'
], function (Rx, mixIn) {
	'use strict';

	function BuildServiceBase(settings, scheduler) {
		this.scheduler = scheduler || Rx.Scheduler.timeout;
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
				serviceIcon: settings.icon,
				tags: [],
				changes: []
			};
		};

		var states = {};
		settings.projects.forEach(function (buildId) {
			states[buildId] = createDefaultState(buildId, settings);
		});
		return states;
	};

	var updateAll = function () {
		var self = this;
		return Rx.Observable.fromArray(this.settings.projects)
			.select(function getBuildById(buildId) {
				return new self.Build(buildId, self.settings);
			}).selectMany(function updateBuild(build) {
				return build.update().catchException(function (ex) {
						return Rx.Observable.returnValue({
							id: build.id,
							error: createError(ex)
						});
					});
			}).select(function (state) { return self.mixInMissingState(state); })
			.doAction(function (state) { return self.processBuildUpdate(state); });
	};

	var createError = function (ex) {
		var error;
		if (ex && ex.message) {
			error = {
				name: ex.name,
				message: ex.message.toString(),
				description: ex.description ? ex.description : ex.message,
				url: ex.url,
				httpStatus: ex.httpStatus,
				stack: ex.stack
			};
		} else {
			error = { name: 'UnknownError', message: JSON.stringify(ex) };
		}
		return error;
	};

	var mixInMissingState = function (state) {
		var previous = this.latestBuildStates[state.id];
		var defaults = {
			name: previous.name,
			group: previous.group,
			webUrl: previous.webUrl,
			isBroken: previous.isBroken,
			isRunning: previous.isRunning,
			isDisabled: previous.isDisabled,
			serviceName: this.settings.name,
			serviceIcon: this.settings.icon,
			tags: []
		};
		return mixIn(defaults, state);
	};

	var processBuildUpdate = function (newState) {
		newState.changes = getUniqueChanges(newState.changes);
		var lastState = this.latestBuildStates[newState.id];
		this.latestBuildStates[newState.id] = newState;
		if (!lastState.error && newState.error) {
			this.events.onNext({ eventName: 'buildOffline', details: newState, source: newState.serviceName });
		}
		if (lastState.error && !newState.error) {
			this.events.onNext({ eventName: 'buildOnline', details: newState, source: newState.serviceName });
		}
		if (!lastState.isBroken && newState.isBroken) {
			this.events.onNext({ eventName: 'buildBroken', details: newState, source: newState.serviceName });
		}
		if (lastState.isBroken && !newState.isBroken) {
			this.events.onNext({ eventName: 'buildFixed', details: newState, source: newState.serviceName });
		}
		if (!lastState.isRunning && newState.isRunning) {
			this.events.onNext({ eventName: 'buildStarted', details: newState, source: newState.serviceName });
		}
		if (lastState.isRunning && !newState.isRunning) {
			this.events.onNext({ eventName: 'buildFinished', details: newState, source: newState.serviceName });
		}
		if (newState.error && newState.error.name === 'UnauthorisedError') {
			this.events.onNext({ eventName: 'passwordExpired', details: newState, source: newState.serviceName });
		}
	};

	var getUniqueChanges = function (allChanges) {
		return !allChanges ? [] : allChanges.reduce(function (changes, value) {
			var alreadyAdded = changes.filter(function (change) {
				return change.name === value.name;
			}).length > 0;
			if (!alreadyAdded) {
				changes.push(value);
			}
			return changes;
		}, []);
	};

	var start = function () {
		if (!this.settings.updateInterval) {
			throw { name: 'ArgumentInvalid', message: 'updateInterval not defined'};
		}
		if (this.poolingSubscription !== null) {
			return Rx.Observable.empty();
		}
		var self = this;
		var updateInterval = this.settings.updateInterval * 1000;
		this.eventsSubscription = this.events.subscribe(function (event) {
			self.activeProjects.onNext(createState(self));
		});
		var updates = new Rx.Subject();
		var initialize = updates
			.take(1)
			.doAction(function (states) {
				self.events.onNext({
					eventName: 'serviceStarted',
					source: self.settings.name,
					details: states
				});
			});
		this.poolingSubscription = Rx.Observable.timer(0, updateInterval, this.scheduler)
			.selectMany(function () {
				return self.updateAll().toArray();
			})
			.catchException(function (ex) {
				console.error('*** Pooling subscription error ***', ex, ex.message);
				self.events.onNext({
					eventName: 'UnknownError',
					details: { message: ex.message, error: ex },
					source: self.settings.name
				});
				return Rx.Observable.throwException(ex);
			})
			.subscribe(updates);
		return initialize;
	};

	var stop = function () {
		if (this.poolingSubscription && !this.poolingSubscription.isStopped) {
			this.poolingSubscription.dispose();
			this.poolingSubscription = null;
			this.events.onNext({ eventName: 'serviceStopped', source: this.settings.name });
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
