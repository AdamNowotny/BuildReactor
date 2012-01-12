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