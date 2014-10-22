define([
	'rx',
	'core/config/localStore',
	'common/arrayEquals',
	'rx.binding'
], function (Rx, configStore, arrayEquals) {

	'use strict';

	var changes = new Rx.BehaviorSubject(configStore.getAll());

	var getAll = function () {
		return configStore.getAll();
	};

	var setOrder = function (serviceNames) {
		var oldConfig = configStore.getAll();
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
	  		configStore.store(newConfigs);
			changes.onNext(newConfigs);
  		}
	};

	var setBuildOrder = function (serviceName, builds) {
		var newConfigs = configStore.getAll().map(function (serviceConfig) {
			if (serviceConfig.name === serviceName) {
				serviceConfig.projects = builds;
			}
			return serviceConfig;
		});
		configStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var enableService = function (serviceName) {
		var newConfigs = configStore.getAll().map(function (config) {
			if (config.name === serviceName) {
				config.disabled = false;
			}
			return config;
		});
		configStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var disableService = function (serviceName) {
		var newConfigs = configStore.getAll().map(function (config) {
			if (config.name === serviceName) {
				config.disabled = true;
			}
			return config;
		});
		configStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var removeService = function (serviceName) {
		var newConfigs = configStore.getAll().filter(function (config) {
			return config.name !== serviceName;
		});
		configStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var renameService = function (oldName, newName) {
		var newConfigs = configStore.getAll().map(function (config) {
			if (config.name === oldName) {
				config.name = newName;
			}
			return config;
		});
		configStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	var saveService = function (settings) {
		var isNew = true;
		var newConfigs = configStore.getAll().map(function (config) {
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
		configStore.store(newConfigs);
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
