define(['signals'], function (signals) {

	var showCalled = 0;
	var showCalledDivId;

	var MockSettingsController = function () {
		this.saveClicked = new signals.Signal();
		this.settings = {
			settingsController: 'mocks/MockSettingsController',
			url: 'http://www.example.com/',
			name: 'service name'
		};
		this.show = function (contentDivId) {
			if (showCalledDivId === undefined || showCalledDivId == contentDivId) {
				showCalled++;
			}
		};
	};

	MockSettingsController.prototype.filterShowCalled = function (divId) {
		showCalledDivId = divId;
	};

	MockSettingsController.prototype.resetShowCalled = function () {
		showCalled = 0;
		showCalledDivId = undefined;
	};

	MockSettingsController.prototype.getShowCalled = function () {
		return showCalled;
	};

	return MockSettingsController;
});