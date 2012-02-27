define(function () {

    var MockSettingsBuilder = function () {
    	this.settings = {
    		baseUrl: 'tests/mocks',
            service: 'mockBuildService',
            settingsController: 'mockSettingsController',
            settingsPage: 'serviceOptionsPage.html',
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
        this.withSettingsPage = function (page) {
        	this.settings.settingsPage = page;
            return this;
        };
        this.withService = function (serviceModuleName) {
            this.settings.service = serviceModuleName;
            return this;
        };
    };

    return MockSettingsBuilder;
});