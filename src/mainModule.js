require.config({
	baseUrl: 'src',
	paths: {
		signals: '../lib/js-signals/signals',
		contract: '../lib/jsContract/jsContract',
		jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min',
		ejs: '../lib/ejs-1.0/ejs',
		text: '../lib/requirejs/text'
	},
	priority: [
		'jquery',
		'contract',
		'stringExtensions',
		'ejs'
	]
});
define([
		'serviceController',
		'notificationController',
		'settingsStore'
	], function (serviceController, notificationController, settingsStore) {

	    initializeLogging();
	    var settings = settingsStore.getAll();
	    notificationController.initialize();
	    serviceController.load(settings);

	    function initializeLogging() {
	        window.onerror = function (message, url, line) {
	            console.error('Unhandled error. message=[{0}], url=[{1}], line=[{2}]'.format(message, url, line));
	            return false; // don't suppress default handling
	        };
	    }

	    return {
	        run: function () {
	            serviceController.run();
	        },
	        getSettings: function () {
	            return settingsStore.getAll();
	        },
	        updateSettings: function (newSettings) {
	            settingsStore.store(newSettings);
	            serviceController.load(newSettings);
	            serviceController.run();
	        }
	    };
	});
