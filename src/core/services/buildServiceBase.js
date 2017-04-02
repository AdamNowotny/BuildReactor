/* eslint no-console: 0 */

define([
	'rx',
	'mout/object/mixIn',
	'rx/dist/rx.time',
	'rx/dist/rx.binding'
], function(Rx, mixIn) {
	'use strict';

	function BuildServiceBase(settings, serviceInfo, scheduler) {
		this.scheduler = scheduler || Rx.Scheduler.timeout;
		this.Build = null;
		this.settings = settings;
		this.serviceInfo = serviceInfo;
		this.updateAll = updateAll;
		this.start = start;
		this.stop = stop;
		this.events = new Rx.Subject();
		this.poolingSubscription = null;
	}

	var updateAll = function() {
		var self = this;
		return Rx.Observable.fromArray(this.settings.projects)
			.select(function getBuildById(buildId) {
				return new self.Build(buildId, self.settings);
			}).selectMany(function updateBuild(build) {
				return build.update().catch(function(ex) {
						return Rx.Observable.return({
							id: build.id,
							error: createError(ex)
						});
					});
			});
	};

	var createError = function(ex) {
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

	var start = function() {
		if (!this.settings.updateInterval) {
			throw new Error('updateInterval not defined');
		}
		if (this.poolingSubscription !== null) {
			return Rx.Observable.empty();
		}
		var self = this;
		var updateInterval = this.settings.updateInterval * 1000;
		var updates = new Rx.Subject();
		this.poolingSubscription = Rx.Observable.timer(0, updateInterval, this.scheduler)
			.selectMany(function() {
				return self.updateAll().toArray();
			})
			.do((state) => {
				self.events.onNext({
					eventName: 'serviceUpdated',
					source: self.settings.name,
					details: state
				});
			})
			.catch(function(ex) {
				console.error('*** Pooling subscription error ***', ex, ex.message);
				self.events.onNext({
					eventName: 'UnknownError',
					details: { message: ex.message, error: ex },
					source: self.settings.name
				});
				return Rx.Observable.throw(ex);
			})
			.subscribe(updates);
		return updates.take(1);
	};

	var stop = function() {
		if (this.poolingSubscription && !this.poolingSubscription.isStopped) {
			this.poolingSubscription.dispose();
			this.poolingSubscription = null;
		}
	};

	return BuildServiceBase;
});
