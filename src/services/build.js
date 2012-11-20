define(['signals'], function (Signal) {
	'use strict';

	var Build = function (id) {
		this.id = id;
		this.name = null;
		this.projectName = null;
		this.webUrl = null;
		this.isBroken = false;
		this.isRunning = false;
		this.on = {
			errorThrown: new Signal(),
			broken: new Signal(),
			fixed: new Signal(),
			started: new Signal(),
			finished: new Signal()
		};
	};

	return Build;
});