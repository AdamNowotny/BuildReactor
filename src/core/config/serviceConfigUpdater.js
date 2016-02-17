define(function () {
    'use strict';
    
    var update = function(config) {
        return isValid(config) ? config.map(updateVersion2) : [];
    };

    var updateVersion2 = function(service) {
        return {
            baseUrl: service.baseUrl,
            projects: service.projects,
            url: service.url,
            username: service.username,
            password: service.password,
            updateInterval: service.updateInterval,
            name: service.name,
            disabled: service.disabled,
            branch: service.branch
        };
    };

    var isValid = function(config) {
        var isArray = Boolean(config) && config.length > -1;
        return isArray && config.every(function (value) {
            return typeof value === 'object';
        });
    };

    return {
        update: update
    };
});
