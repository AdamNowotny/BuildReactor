define(function () {

    var MockSettingsBuilder = function () {
        this.settings = {
            service: 'mocks/FakeBuildService',
            settingsController: 'mocks/MockSettingsController',
            url: 'http://www.example.com/',
            name: 'service name'
        };
        this.create = function () {
            return this.settings;
        };
        this.withName = function (name) {
            this.settings.name = name;
            return this;
        };
        this.withService = function (serviceModuleName) {
            this.settings.service = serviceModuleName;
            return this;
        };
    };

    return MockSettingsBuilder;
});