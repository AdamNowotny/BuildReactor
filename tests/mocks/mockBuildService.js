define(['signals'], function (signals) {

	var MockBuildService = function () {
		this.name = 'Sample service';
		this.updateStarted = new signals.Signal();
		this.updateFinished = new signals.Signal();
		this.buildFailed = new signals.Signal();
		this.buildFixed = new signals.Signal();
		this.errorThrown = new signals.Signal();
		this.start = function () { };
		this.stop = function() { };
		this.initializeFromSettings = function (settings) {
			this.name = settings.name;
		};
	};

	return MockBuildService;
});