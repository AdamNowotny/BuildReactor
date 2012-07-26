define(['signals'], function (signals) {

	'use strict';
	
	var MockBuildService = function () {
		this.name = 'Sample service';
		this.on = {
			errorThrown: new signals.Signal(),
			updating: new signals.Signal(),
			updated: new signals.Signal(),
			brokenBuild: new signals.Signal(),
			fixedBuild: new signals.Signal()
		};
		this.start = function () { };
		this.stop = function () { };
		this.initializeFromSettings = function (settings) {
			this.name = settings.name;
		};
	};

	return MockBuildService;
});