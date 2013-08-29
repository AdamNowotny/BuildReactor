// Karma configuration
// Generated on Wed Aug 28 2013 22:18:26 GMT+1000 (AUS Eastern Standard Time)

module.exports = function (config) {
	'use strict';

	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '.',


		// frameworks to use
		frameworks: ['jasmine', 'requirejs'],

		// don't use html2js for Handlebars templates
		preprocessors: {
		},

		// list of files / patterns to load in the browser
		files: [
			{pattern: 'bower_components/jquery/jquery.js', watched: false, served: true, included: true},
			{pattern: 'bower_components/jasmine-jquery/lib/jasmine-jquery.js', watched: false, served: true, included: true},
			'src/requirejs-config.js',
			'src/test-karma.js',
			{pattern: 'src/**/*', watched: true, served: true, included: false},
			{pattern: 'lib/**/*', watched: true, served: true, included: false},
			{pattern: 'bower_components/**/*.js', watched: false, served: true, included: false},
		],

		// list of files to exclude
		exclude: [
			'src/dashboard.js',
			'src/main.js',
			'src/options.js',
			'src/popup.js',
			'src/rxjs.js'
		],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['junit'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: [process.env.TRAVIS ? 'PhantomJS' : 'Chrome'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};
