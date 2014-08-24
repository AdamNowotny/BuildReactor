/*global module:false, process:false*/
// Karma configuration
module.exports = function (config) {
	'use strict';

	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '../..',


		// frameworks to use
		frameworks: ['jasmine', 'requirejs'],

		 // generate js files from html templates
		preprocessors: {
			'src/**/directives/**/*.html': ['ng-html2js']
		},

		// list of files / patterns to load in the browser
		files: [
			'src/test/main.js',
			{pattern: 'src/**/*', watched: true, served: true, included: false},
			{pattern: 'bower_components/**/*', watched: false, served: true, included: false},

			// only for http server run with with "grunt test", files available at http://localhost:9876/base/...
			{pattern: 'img/*', watched: false, served: true, included: false},
			{pattern: 'src/**/*.html', watched: false, served: true, included: false}
		],

		exclude: [],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['progress'],

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
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};
