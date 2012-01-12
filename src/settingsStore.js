define([], function () {

    function store(settings) {
        var settingsString = JSON.stringify(settings);
        localStorage.setItem('services', settingsString);
        console.log('settingsStore: new settings stored', settings);
    }

    function getAll() {
        var settings;
        if (localStorage.getItem('services') == null) {
            settings = getDefaultSettings();
        } else {
            var settingsString = localStorage.getItem('services');
            settings = JSON.parse(settingsString);
        }
        return settings;
    }

    function getDefaultSettings() {
    	// TODO: remove when adding services is supported in the UI
    	var bambooSettings = {
    		baseUrl: 'src/bamboo',
            service: 'bambooBuildService',
            settingsController: 'bambooSettingsController',
            settingsPage: 'bambooOptions.html',
            name: 'Atlassian Bamboo CI',
            url: '',
            updateInterval: 60,
            plans: []
        };
        return [bambooSettings];
    }

    return {
        store: store,
        getAll: getAll
    };
});