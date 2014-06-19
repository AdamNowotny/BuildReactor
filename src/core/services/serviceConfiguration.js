define([
	'rx',
	'core/services/configurationStore',
	'rx.binding'
], function (Rx, configurationStore) {

	'use strict';
	
	var changes = new Rx.BehaviorSubject(configurationStore.getAll());

	var getAll = function () {
		return configurationStore.getAll();
	};

	var setAll = function (allConfig) {
		configurationStore.store(allConfig);
		changes.onNext(allConfig);
	};

	var setOrder = function (serviceNames) {
		var oldConfig = configurationStore.getAll();
  		if (oldConfig.length !== serviceNames.length) {
   			throw { name: 'ArgumentInvalid', message: 'All services required'};
  		}
  		var newConfigs = serviceNames.map(function (name) {
  			return oldConfig.filter(function (config) {
  				return config.name === name;
  			})[0];
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
		setAll: setAll,
		setOrder: setOrder,
		enableService: enableService,
		disableService: disableService,
		removeService: removeService,
		renameService: renameService,
		saveService: saveService,
		changes: changes
	};
});