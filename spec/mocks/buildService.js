define(['signals'], function (signals) {

	'use strict';
	
	var receivedProjects = new signals.Signal();
	var errorThrown = new signals.Signal();
	receivedProjects.memorize = true;
	errorThrown.memorize = true;

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

	MockBuildService.prototype.getProjects = function () {
		return {
			receivedProjects: receivedProjects,
			errorThrown: errorThrown
		};
	};

	MockBuildService.settings = function () {
		return {
			typeName: 'Fake service',
			baseUrl: 'mock',
			icon: 'mock/icon.png'
		};
	};

	return MockBuildService;
});