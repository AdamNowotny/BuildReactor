require.config({
	baseUrl: '..',
	paths: {
		jquery: 'lib/jquery/jquery',
		jqueryTools: 'lib/jquery-tools/jquery.tools.min',
		amdUtils: 'lib/amd-utils',
		handlebars: 'lib/requirejs-handlebars-plugin/Handlebars',
		text: 'lib/requirejs/text',
		order: 'lib/requirejs/order',
		signals: 'lib/js-signals/signals',
		bootstrap: 'lib/twitter-bootstrap/js/bootstrap'
	},
	shim: {
		bootstrap: [ 'jquery' ],
		jqueryTools: [ 'jquery' ]
	}
});
require([
		'src/settingsPageController',
		'amdUtils/string/interpolate'
], function (settingsPageController, interpolate) {

	initializeLogging();
	// app already loaded
	var app = chrome.extension.getBackgroundPage().require("src/app");
	settingsPageController.initialize(app.getSupportedServiceTypes());
	settingsPageController.settingsChanged.add(settingsChanged);

	function initializeLogging() {
		window.onerror = function (message, url, line) {
			console.error(interpolate('Unhandled error. message=[{{0}}], url=[{{1}}], line=[{{2}}]', [message, url, line]));
			return false; // don't suppress default handling
		};
	}

	function settingsChanged(updatedSettings) {
		app.updateSettings(updatedSettings);
	}

	var settings = app.getSettings();
	settingsPageController.load(settings);
	
});
