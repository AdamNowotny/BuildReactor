define(['common/timer', 'signals'], function (Timer, Signal) {

	'use strict';

	var PoolingService = function (settings) {
		this.settings = settings;
		this.name = this.settings.name;
		this.on = {
			errorThrown: new Signal(),
			updating: new Signal(),
			updated: new Signal(),
			brokenBuild: new Signal(),
			fixedBuild: new Signal(),
			startedBuild: new Signal(),
			finishedBuild: new Signal()
		};

	};

	PoolingService.prototype.start = function () {
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

	PoolingService.prototype.stop = function () {
		this.on.updated.remove(this.scheduleUpdate, this);
		this.timer.on.elapsed.remove(this.update, this);
	};

	PoolingService.prototype.update = function () { };

	return PoolingService;
});