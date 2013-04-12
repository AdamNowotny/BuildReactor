define(['signals', 'rx'], function (signals, Rx) {

	'use strict';
	
	var errorThrown = new signals.Signal();
	errorThrown.memorize = true;

	var MockBuildService = function () {
		this.settings = { name: 'Sample service' };
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
			this.settings = settings;
		};
	};

	MockBuildService.prototype.availableBuilds = function () {
		return Rx.observable.never();
	};

	MockBuildService.prototype.activeProjects = function () {
		return {
			name: this.settings.name
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