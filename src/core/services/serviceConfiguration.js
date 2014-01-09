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
		var config = configurationStore.getAll();
		config[0].disabled = false;
		configurationStore.store(config);
		changes.onNext(config);
	};
	
	var disableService = function (serviceName) {
		var config = configurationStore.getAll();
		config[0].disabled = true;
		configurationStore.store(config);
		changes.onNext(config);
	};

	return {
		getAll: getAll,
		setAll: setAll,
		enableService: enableService,
		disableService: disableService,
		changes: changes
	};
});