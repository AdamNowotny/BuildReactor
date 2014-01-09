define([
	'rx',
	'core/services/configurationStore'
], function (Rx, configurationStore) {

	'use strict';
	
	var changes = new Rx.Subject();

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

	return {
		getAll: getAll,
		setAll: setAll,
		enableService: enableService,
		disableService: disableService,
		changes: changes
	};
});