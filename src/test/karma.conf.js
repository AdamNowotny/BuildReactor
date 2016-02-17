var webpackConfig = require('../../webpack.config.js');
webpackConfig.entry = {};

module.exports = function (config) {
    'use strict';

    config.set({
        basePath: '../..',
        frameworks: [ 'jasmine' ],
        files: [
            'src/test/main.js',
            'src/common/**/*.spec.js'
        ],
        exclude: [
            'src/core/config/*',
            'src/core/services/**/*'
        ],
        preprocessors: {
          'src/test/main.js': [ 'webpack' ],
          '**/*.spec.js': [ 'webpack' ]
        },
        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],
        // web server port
        port: 9876,
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
        singleRun: true,
        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        }

    });
};
