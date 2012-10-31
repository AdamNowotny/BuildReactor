define([
	'signals',
	'jquery',
	'options/serviceSettings',
	'options/serviceOptionsPage',
	'options/addService',
	'options/serviceList',
	'options/savePrompt',
	'options/removePrompt',
	'options/alert'
], function (signals, $, serviceSettings, serviceOptionsPage, addService, serviceList, savePrompt, removePrompt, alert) {

	'use strict';
	
	var isSaveNeeded = false;
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
		addService.on.selected.add(function (serviceInfo) {
			serviceSettings.add(serviceInfo);
			serviceList.update(serviceSettings.getAll());
			serviceList.selectLast();
			setSaveNeeded(true);
		});
		removePrompt.removeSelected.add(function () {
			removeCurrentService();
		});
		serviceSettings.cleared.add(function () {
			$('.service-actions').hide();
			serviceOptionsPage.hide();
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
			$('.service-name').text(link.text());
			$('.service-actions').show();
			var index = link.data('service-index');
			var serviceInfo = serviceSettings.getByIndex(index);
			showServicePage(serviceInfo);
		});
		serviceOptionsPage.on.updated.add(serviceSettingsChanged);
		reset(serviceTypes);
	}

	function reset(serviceTypes) {
		savePrompt.initialize();
		addService.initialize('.service-add-container', serviceTypes);
		removePrompt.initialize();
		serviceOptionsPage.initialize();
		setSaveNeeded(false);
		serviceSettings.clear();
		$('#service-add-button').click(function () {
			if (!$('#service-add-button').hasClass('disabled')) {
				serviceOptionsPage.hide();
				addService.show();
				$('.service-actions').hide();
				serviceList.selectItem(null);
				$('#service-add-button').addClass('btn-primary');
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
		chrome.extension.sendMessage({name: "updateSettings", settings: serviceSettings.getAll()});
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
		$('#service-add-button').removeClass('btn-primary');
		addService.hide();
		serviceOptionsPage.show(serviceInfo);
	}

	function serviceSettingsChanged(updatedSettings) {
		serviceSettings.update(currentSettings, updatedSettings);
		chrome.extension.sendMessage({name: "updateSettings", settings: serviceSettings.getAll()});
		alert.show();
		setSaveNeeded(false);
		currentSettings = updatedSettings;
	}

	return {
		initialize: initialize,
		load: load
	};
});