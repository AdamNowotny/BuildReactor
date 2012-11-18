define(['common/timer', 'signals'], function (Timer, Signal) {

	'use strict';

	var PoolingService = function (settings) {
		this.settings = settings;
		this.on = {
			updating: new Signal(),
			updated: new Signal()
		};
	};

	var start = function () {
		if (!this.settings.updateInterval) {
			throw { name: 'ArgumentInvalid', message: 'settings.updateInterval not set' };
		}
		this.timer = new Timer();
		this.timer.on.elapsed.add(this.update, this);
		this.scheduleUpdate = function () {
			this.timer.start(this.settings.updateInterval);
		};
		this.on.updated.add(this.scheduleUpdate, this);
		this.update();
	};

	var stop = function () {
		this.on.updated.remove(this.scheduleUpdate, this);
		this.timer.on.elapsed.remove(this.update, this);
	};

	var update = function () {
		this.on.updating.dispatch();
		this.updateAll().addOnce(function () {
			this.on.updated.dispatch();
		}, this);
	};

	PoolingService.prototype = {
		start: start,
		stop: stop,
		update: update
	};

	return PoolingService;
});