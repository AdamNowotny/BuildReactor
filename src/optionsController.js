define([
	'signals',
	'jquery',
	'settings/serviceSettings',
	'settings/serviceOptions',
	'settings/addModal',
	'settings/serviceList',
	'settings/savePrompt',
	'settings/removePrompt',
	'settings/alert'
], function (signals, $, serviceSettings, serviceOptions, addModal, serviceList, savePrompt, removePrompt, alert) {

	'use strict';
	
	var on = {
		settingsChanged: new signals.Signal()
	};
	var isSaveNeeded = false;
	var serviceNameElement;
	var currentSettings;

	function setSaveNeeded(isNeeded) {
		isSaveNeeded = isNeeded;
		$('#service-add-button').toggleClass('disabled', isSaveNeeded);
	}

	function initialize(serviceTypes) {
		savePrompt.removeSelected.add(function () {
			removeCurrentService();
			savePrompt.hide();
		});
		addModal.on.selected.add(function (serviceInfo) {
			serviceSettings.add(serviceInfo);
			serviceList.update(serviceSettings.getAll());
			serviceList.selectLast();
			setSaveNeeded(true);
		});
		removePrompt.removeSelected.add(function () {
			removeCurrentService();
		});
		serviceSettings.cleared.add(function () {
			serviceNameElement.text('');
			serviceOptions.show(null);
		});
		serviceList.itemClicked.add(function (item) {
			if (isSaveNeeded) {
				savePrompt.show(serviceList.getSelectedName());
			} else {
				serviceList.selectItem(item);
			}
		});
		serviceList.itemSelected.add(function (item) {
			var link = $(item);
			serviceNameElement.text(link.text());
			var index = link.data('service-index');
			var serviceInfo = serviceSettings.getByIndex(index);
			showServicePage(serviceInfo);
		});
		serviceOptions.on.updated.add(serviceSettingsChanged);
		reset(serviceTypes);
	}

	function reset(serviceTypes) {
		savePrompt.initialize();
		addModal.initialize(serviceTypes);
		removePrompt.initialize();
		serviceOptions.initialize();
		setSaveNeeded(false);
		serviceSettings.clear();
		serviceNameElement = $('#service-name');
		$('#service-add-button').click(function () {
			if (!$('#service-add-button').hasClass('disabled')) {
				addModal.show();
			}
		});
		$('#service-remove-button').click(function () {
			removePrompt.show(serviceList.getSelectedName());
		});
	}

	function removeCurrentService() {
		setSaveNeeded(false);
		serviceSettings.remove(currentSettings);
		serviceList.update(serviceSettings.getAll());
		on.settingsChanged.dispatch(serviceSettings.getAll());
	}

	function load(newSettings) {
		serviceSettings.load(newSettings);
		serviceList.load(newSettings);
	}

	function showServicePage(serviceInfo) {
		if (serviceInfo === undefined) {
			throw { name: 'showServicePage', message: 'serviceInfo is undefined' };
		}
		currentSettings = serviceInfo;
		serviceOptions.show(serviceInfo);
	}

	function serviceSettingsChanged(updatedSettings) {
		serviceSettings.update(currentSettings, updatedSettings);
		on.settingsChanged.dispatch(serviceSettings.getAll());
		alert.show();
		setSaveNeeded(false);
		currentSettings = updatedSettings;
	}

	return {
		initialize: initialize,
		load: load,
		on: on
	};
});