/* eslint-env node */
/* eslint no-process-env: 0 */
process.env.CHROME_BIN = require('puppeteer').executablePath();

const webpackConfig = require('../../webpack.config.js');
// remove entrypoints, test/main.js will be used
webpackConfig.entry = undefined;
webpackConfig.devtool = 'inline-source-map';

module.exports = function(config) {
    config.set({
        basePath: '../..',
        frameworks: ['jasmine', 'webpack'],
        files: [
            'src/test/main.js'
        ],
        preprocessors: {
          'src/test/main.js': ['webpack', 'sourcemap']
        },
        plugins: [
          'karma-webpack',
          'karma-jasmine',
          'karma-sourcemap-loader',
          'karma-chrome-launcher'
        ],
        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],
        // web server port
        port: 9876,
        colors: true,
        // level of logging
        // possible values:
        //   config.LOG_DISABLE
        //   config.LOG_ERROR
        //   config.LOG_WARN
        //   config.LOG_INFO
        //   config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        browsers: ['Chrome_without_security'],
        // required for running ChromeHeadless in docker
        customLaunchers: {
          Chrome_without_security: {
            base: 'ChromeHeadless',
            flags: [
              '--disable-web-security',
              '--disable-gpu',
              '--no-sandbox'
            ],
          },
        },
        singleRun: true,
        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        }
    });
};
