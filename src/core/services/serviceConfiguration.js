define([
	'rx',
	'core/services/configurationStore',
	'common/arrayEquals',
	'rx.binding'
], function (Rx, configurationStore, arrayEquals) {

	'use strict';

	var changes = new Rx.BehaviorSubject(configurationStore.getAll());

	var getAll = function () {
		return configurationStore.getAll();
	};

	var setOrder = function (serviceNames) {
		var oldConfig = configurationStore.getAll();
  		if (oldConfig.length !== serviceNames.length) {
   			throw { name: 'ArgumentInvalid', message: 'All services required'};
  		}
  		var oldServiceNames = oldConfig.map(function (config) {
  			return config.name;
  		});
  		var newConfigs = serviceNames.map(function (name) {
  			return oldConfig.filter(function (config) {
  				return config.name === name;
  			})[0];
  		});
  		if (!arrayEquals(oldServiceNames, serviceNames)) {
	  		configurationStore.store(newConfigs);
			changes.onNext(newConfigs);
  		}
	};

	var setBuildOrder = function (serviceName, builds) {
		var newConfigs = configurationStore.getAll().map(function (serviceConfig) {
			if (serviceConfig.name === serviceName) {
				serviceConfig.projects = builds;
			}
			return serviceConfig;
		});
		configurationStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var enableService = function (serviceName) {
		var newConfigs = configurationStore.getAll().map(function (config) {
			if (config.name === serviceName) {
				config.disabled = false;
			}
			return config;
		});
		configurationStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var disableService = function (serviceName) {
		var newConfigs = configurationStore.getAll().map(function (config) {
			if (config.name === serviceName) {
				config.disabled = true;
			}
			return config;
		});
		configurationStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var removeService = function (serviceName) {
		var newConfigs = configurationStore.getAll().filter(function (config) {
			return config.name !== serviceName;
		});
		configurationStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var renameService = function (oldName, newName) {
		var newConfigs = configurationStore.getAll().map(function (config) {
			if (config.name === oldName) {
				config.name = newName;
			}
			return config;
		});
		configurationStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var saveService = function (settings) {
		var isNew = true;
		var newConfigs = configurationStore.getAll().map(function (config) {
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
		configurationStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	return {
		getAll: getAll,
		setOrder: setOrder,
		setBuildOrder: setBuildOrder,
		enableService: enableService,
		disableService: disableService,
		removeService: removeService,
		renameService: renameService,
		saveService: saveService,
		changes: changes
	};
});
