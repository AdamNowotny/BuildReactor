define([
	'signals',
	'jquery',
	'options/serviceSettings',
	'options/serviceOptionsPage',
	'options/addService',
	'options/serviceList',
	'options/alert',
	'bootbox'
], function (signals, $, serviceSettings, serviceOptionsPage, addService, serviceList, alert, bootbox) {

	'use strict';
	
	var isSaveNeeded = false;
	var currentSettings;

	function setSaveNeeded(isNeeded) {
		isSaveNeeded = isNeeded;
		$('#service-add-button').toggleClass('disabled', isSaveNeeded);
	}

	function initialize(serviceTypes) {
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
			bootbox.dialog(serviceList.getSelectedName(), [
				{
					label: 'Cancel',
					icon: 'icon-ban-circle'
				}, {
					label: 'Remove',
					icon: 'icon-trash icon-white',
					'class': 'btn-danger',
					callback: function () {
						removeCurrentService();
					}
				}
			], {
				header: 'Remove',
				onEscape: true
			});
		});
		$('#service-rename-action').click(function () {
			bootbox.setIcons({
				'OK': 'icon-pencil icon-white',
				'CANCEL': 'icon-ban-circle'
			});
			bootbox.prompt(
				'Rename ' + serviceList.getSelectedName(),
				'Cancel',
				'Rename',
				function (result) {
					if (result !== null) {
						currentSettings.name = result;
						serviceSettingsChanged(currentSettings);
						serviceList.update(serviceSettings.getAll());
					}
				},
				serviceList.getSelectedName()
			);
		});
		addService.on.selected.add(function (serviceInfo) {
			serviceSettings.add(serviceInfo);
			serviceList.update(serviceSettings.getAll());
			serviceList.selectLast();
			setSaveNeeded(true);
		});
		serviceSettings.cleared.add(function () {
			$('.service-actions').hide();
			serviceOptionsPage.hide();
		});
		serviceList.itemClicked.add(function (item) {
			if (isSaveNeeded) {
				bootbox.dialog(serviceList.getSelectedName(), [
					{
						label: "Cancel",
						icon: 'icon-ban-circle'
					}, {
						label: 'Remove',
						icon: 'icon-trash icon-white',
						'class': 'btn-danger',
						callback: function () {
							removeCurrentService();
						}
					//}, {
					//	label: 'Save',
					//	icon: 'icon-ok icon-white',
					//	'class': 'btn-success',
					//	callback: function () {
					//		serviceList.selectItem(item);
					//	}
					}
				], {
					header: 'Service not saved yet',
					onEscape: true
				});
			} else {
				serviceList.selectItem(item);
			}
		});
		serviceList.itemSelected.add(function (item) {
			var link = $(item);
			$('.service-name').text(link.text().trim());
			$('.service-actions').show();
			var index = link.data('service-index');
			var serviceInfo = serviceSettings.getByIndex(index);
			showServicePage(serviceInfo);
		});
		serviceOptionsPage.on.updated.add(serviceSettingsChanged);
		addService.initialize('.service-add-container', serviceTypes);
		serviceOptionsPage.initialize();
		setSaveNeeded(false);
		serviceSettings.clear();
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
		$('.service-name').text(currentSettings.name);
	}

	return {
		initialize: initialize,
		load: load
	};
});