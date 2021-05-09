import Rx from 'rx';
import arrayEquals from 'common/arrayEquals';
import configStore from 'core/config/localStore';
import configUpdater from 'core/config/serviceConfigUpdater';

var key = 'services';
var changes = new Rx.BehaviorSubject(configStore.getItem(key));

var init = function() {
    var config = configUpdater.update(configStore.getItem(key));
    configStore.setItem(key, config);
    changes.onNext(config);
};

var setOrder = function(serviceNames) {
    var oldConfig = configStore.getItem(key);
    if (oldConfig.length !== serviceNames.length) {
        throw new Error('All services required');
    }
    var oldServiceNames = oldConfig.map(function(config) {
        return config.name;
    });
    var newConfigs = serviceNames.map(function(name) {
        return oldConfig.filter(function(config) {
            return config.name === name;
        })[0];
    });
    if (!arrayEquals(oldServiceNames, serviceNames)) {
        configStore.setItem(key, newConfigs);
        changes.onNext(newConfigs);
    }
};

var setBuildOrder = function(serviceName, builds) {
    var newConfigs = configStore.getItem(key).map(function(serviceConfig) {
        if (serviceConfig.name === serviceName) {
            serviceConfig.projects = builds;
        }
        return serviceConfig;
    });
    configStore.setItem(key, newConfigs);
    changes.onNext(newConfigs);
};

var enableService = function(serviceName) {
    var newConfigs = configStore.getItem(key).map(function(config) {
        if (config.name === serviceName) {
            config.disabled = false;
        }
        return config;
    });
    configStore.setItem(key, newConfigs);
    changes.onNext(newConfigs);
};

var disableService = function(serviceName) {
    var newConfigs = configStore.getItem(key).map(function(config) {
        if (config.name === serviceName) {
            config.disabled = true;
        }
        return config;
    });
    configStore.setItem(key, newConfigs);
    changes.onNext(newConfigs);
};

var removeService = function(serviceName) {
    var newConfigs = configStore.getItem(key).filter(function(config) {
        return config.name !== serviceName;
    });
    configStore.setItem(key, newConfigs);
    changes.onNext(newConfigs);
};

var renameService = function(oldName, newName) {
    var newConfigs = configStore.getItem(key).map(function(config) {
        if (config.name === oldName) {
            config.name = newName;
        }
        return config;
    });
    configStore.setItem(key, newConfigs);
    changes.onNext(newConfigs);
};

var saveService = function(settings) {
    var isNew = true;
    var newConfigs = configStore.getItem(key).map(function(config) {
        if (config.name === settings.name) {
            isNew = false;
            return settings;
        } else {
            return config;
        }
    });
    if (isNew) {
        newConfigs.push(settings);
    }
    configStore.setItem(key, newConfigs);
    changes.onNext(newConfigs);
};

var save = function(config) {
    configStore.setItem(key, config);
    changes.onNext(config);
};

export default {
    init: init,
    setOrder: setOrder,
    setBuildOrder: setBuildOrder,
    enableService: enableService,
    disableService: disableService,
    removeService: removeService,
    renameService: renameService,
    saveService: saveService,
    save: save,
    changes: changes
};
