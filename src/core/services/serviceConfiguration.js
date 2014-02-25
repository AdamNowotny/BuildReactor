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

	var updateService = function (settings) {
		var newConfigs = configurationStore.getAll().map(function (config) {
			return (config.name === settings.name) ? settings : config;
		});
		configurationStore.store(newConfigs);
		changes.onNext(newConfigs);
	};

	return {
		getAll: getAll,
		setAll: setAll,
		enableService: enableService,
		disableService: disableService,
		removeService: removeService,
		renameService: renameService,
		updateService: updateService,
		changes: changes
	};
});