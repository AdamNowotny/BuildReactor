require.config({
    baseUrl: 'tests',
    paths: {
        src: '../src',
        signals: '../lib/js-signals/signals',
        contract: '../lib/jsContract/jsContract',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery',
        text: '../lib/requirejs/text',
        json: '../lib/requirejs/json',
        SignalLogger: '../lib/js-signal-logger/SignalLogger',
        ejs: '../lib/ejs-1.0/ejs'
    },
    priority: [
        'signals',
        'contract',
        'jquery',
        'src/stringExtensions',
        'ejs'
    ]
});

define([
        'ajaxRequestTest',
        'notificationControllerTest',
        'serviceControllerTest',
        'settingsControllerTest',
        'settingsStoreTest',
        'timerTest',
        'bamboo/bambooBuildServiceTest',
        'bamboo/bambooPlanTest',
        'bamboo/bambooRequestTest',
        'bamboo/bambooSettingsControllerTest'
    ], function() {

        return {
            runSpecs: function() {
                jasmine.getFixtures().fixturesPath = 'tests/testdata';
                jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
                jasmine.getEnv().execute();
            }
        };
    });