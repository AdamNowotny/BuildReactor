define([
	'rx',
	'core/config/localStore',
	'core/config/viewConfigUpdater',
	'rx.binding'
], function (Rx, configStore, configUpdater) {

	'use strict';

	var key = 'views';
	var changes = new Rx.BehaviorSubject(configStore.getItem(key));

	var init = function () {
		var config = configUpdater.update(configStore.getItem(key));
		configStore.setItem(key, config);
		changes.onNext(config);
	};

	var save = function (config) {
		configStore.setItem(key, config);
		changes.onNext(config);
	};

	return {
		init: init,
		save: save,
		changes: changes
	};
});
