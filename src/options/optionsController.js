define([
	'signals',
	'common/core',
	'jquery',
	'options/serviceSettings',
	'options/serviceOptionsPage',
	'options/addService',
	'options/serviceList',
	'options/alert',
	'rx'
], function (signals, core, $, serviceSettings, serviceOptionsPage, addService, serviceList, alert, Rx) {

	'use strict';
	
	var isNewService = false;
	var currentSettings;
	var currentServices = new Rx.ReplaySubject();

	function setIsNewService(isNew) {
		isNewService = isNew;
		$('#service-add-pill').toggleClass('disabled', isNewService);
	}

	function initialize(serviceTypes) {
		// $('.toggle-button').toggleButtons({
		//	onChange: function ($el, checked, e) {
		//		var disabled = !checked;
		//		if (currentSettings.disabled !== disabled) {
		//			currentSettings.disabled = disabled;
		//			if (!isNewService) {
		//				serviceSettingsChanged(currentSettings);
		//			}
		//		}
		//	},
		//	style: {
		//		disabled: 'danger',
		//		custom: {
		//			enabled: {
		//				background: "#e6e6e6",
		//				gradient: "#fefefe",
		//				color: "black"
		//			}
		//		}
		//	}
		// });
		$('#service-add-button').click(function () {
			if (!$('#service-add-pill').hasClass('disabled')) {
				serviceOptionsPage.hide();
				addService.show();
				serviceList.selectItem(null);
				$('#service-add-pill').addClass('active');
				currentServices.onNext(null);
			}
		});
		// $('#service-remove-button').click(function () {
		//	bootbox.dialog(serviceList.getSelectedName(), [
		//		{
		//			label: 'Cancel',
		//			icon: 'icon-ban-circle'
		//		}, {
		//			label: 'Remove',
		//			icon: 'icon-trash icon-white',
		//			'class': 'btn-danger',
		//			callback: function () {
		//				removeCurrentService();
		//			}
		//		}
		//	], {
		//		header: 'Remove',
		//		onEscape: true
		//	});
		// });
		// $('#service-rename-action').click(function () {
		//	bootbox.setIcons({
		//		'OK': 'icon-pencil icon-white',
		//		'CANCEL': 'icon-ban-circle'
		//	});
		//	bootbox.prompt(
		//		'Rename ' + serviceList.getSelectedName(),
		//		'Cancel',
		//		'Rename',
		//		function (result) {
		//			if (result !== null) {
		//				currentSettings.name = result;
		//				serviceSettingsChanged(currentSettings);
		//				serviceList.update(serviceSettings.getAll());
		//			}
		//		},
		//		serviceList.getSelectedName()
		//	);
		// });
		addService.on.selected.add(function (serviceInfo) {
			setIsNewService(true);
			serviceSettings.add(serviceInfo);
			serviceList.update(serviceSettings.getAll());
			serviceList.selectLast();
		});
		serviceSettings.cleared.add(function () {
			// $('.service-action').hide();
			$('.service-list-separator').hide();
			$('#service-add-button').click();
		});
		serviceList.itemClicked.add(function (item) {
			// if (isNewService) {
				// bootbox.dialog(serviceList.getSelectedName(), [
				//	{
				//		label: "Cancel",
				//		icon: 'icon-ban-circle'
				//	}, {
				//		label: 'Remove',
				//		icon: 'icon-trash icon-white',
				//		'class': 'btn-danger',
				//		callback: function () {
				//			removeCurrentService();
				//		}
				//	}
				// ], {
				//	header: 'Service not saved yet',
				//	onEscape: true
				// });
			// } else {
			serviceList.selectItem(item);
			// }
		});
		serviceList.itemSelected.add(function (item) {
			var link = $(item);
			var index = link.data('service-index');
			var serviceInfo = serviceSettings.getByIndex(index);
			showServicePage(serviceInfo);
			$('.service-list-separator').show();
		});
		serviceOptionsPage.on.updated.add(serviceSettingsChanged);
		addService.initialize('.service-add-container', serviceTypes);
		serviceOptionsPage.initialize();
		setIsNewService(false);
		serviceSettings.clear();
	}

	function removeCurrentService() {
		setIsNewService(false);
		serviceSettings.remove(currentSettings);
		serviceList.update(serviceSettings.getAll());
		core.updateSettings(serviceSettings.getAll());
	}

	function load(newSettings) {
		serviceSettings.load(newSettings);
		serviceList.load(newSettings);
	}

	function showServicePage(serviceInfo) {
		if (serviceInfo === undefined) {
			throw { name: 'showServicePage', message: 'serviceInfo is undefined' };
		}
		currentServices.onNext(serviceInfo);
		currentSettings = serviceInfo;
		$('#service-add-pill').removeClass('active');
		addService.hide();
		serviceOptionsPage.show(serviceInfo);
	}

	function serviceSettingsChanged(updatedSettings) {
		// updatedSettings.disabled = !$('.toggle-button').toggleButtons('status');
		serviceSettings.update(currentSettings, updatedSettings);
		core.updateSettings(serviceSettings.getAll());
		alert.show();
		setIsNewService(false);
		currentServices.onNext(updatedSettings);
		currentSettings = updatedSettings;
		serviceList.update(serviceSettings.getAll());
	}

	return {
		initialize: initialize,
		load: load,
		currentServices: currentServices
	};
});