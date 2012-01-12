define(['settingsController'], function(settingsController) {

	initializeLogging();
	var mainModule = chrome.extension.getBackgroundPage().require("mainModule");
	settingsController.settingsChanged.add(settingsChanged);

	function initializeLogging() {
		window.onerror = function(message, url, line) {
			console.error('Unhandled error. message=[{0}], url=[{1}], line=[{2}]'.format(message, url, line));
			return false; // don't suppress default handling
		};
	}

	function settingsChanged(updatedSettings) {
		mainModule.updateSettings(updatedSettings);
	}

	return {
		show: function() {
			var settings = mainModule.getSettings();
			settingsController.show(settings);
		}
	};
});
