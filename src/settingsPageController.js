define([
	'signals',
	'jquery',
	'settings/serviceSettings',
	'settings/frame',
	'settings/addModal',
	'settings/serviceList',
	'settings/savePrompt',
	'settings/removePrompt',
	'timer'
], function (signals, $, serviceSettings, frame, addModal, serviceList, savePrompt, removePrompt, Timer) {

	var isInitialized = false;
	var settingsChanged = new signals.Signal();
	var isSaveNeeded = false;
	var serviceNameElement;
	var current;

	var alertTimer = new Timer();
	alertTimer.elapsed.add(function () {
		$('#alert-saved .alert').removeClass('in');
	});

	function setSaveNeeded(isNeeded) {
		isSaveNeeded = isNeeded;
		$('#service-add-button').toggleClass('disabled', isSaveNeeded);
	}

	function initialize(supportedServiceTypes) {
		if (!isInitialized) {
			savePrompt.removeSelected.add(function () {
				removeCurrentService();
				savePrompt.hide();
			});
			addModal.serviceAdded.add(function (serviceInfo) {
				serviceSettings.add(serviceInfo);
				serviceList.add(serviceInfo);
				setSaveNeeded(true);
			});
			removePrompt.removeSelected.add(function () {
				removeCurrentService();
			});
			serviceSettings.cleared.add(function () {
				serviceNameElement.text('');
				frame.showEmpty();
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
			frame.saved.add(serviceSettingsChanged);
			isInitialized = true;
		}
		reset(supportedServiceTypes);
	}

	function reset(supportedServiceTypes) {
		savePrompt.initialize();
		addModal.initialize(supportedServiceTypes);
		removePrompt.initialize();
		frame.initialize();
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
		serviceSettings.remove(current);
		serviceList.update(serviceSettings.getAll());
		settingsChanged.dispatch(serviceSettings.getAll());
	}

	function load(newSettings) {
		serviceSettings.load(newSettings);
		serviceList.load(newSettings);
	}

	function showServicePage(serviceInfo) {
		if (serviceInfo === undefined) {
			throw { name: 'showServicePage', message: 'serviceInfo is undefined' };
		}
		current = serviceInfo;
		frame.show(serviceInfo);
	}

	function serviceSettingsChanged(updatedSettings) {
		serviceSettings.update(current, updatedSettings);
		settingsChanged.dispatch(serviceSettings.getAll());
		$('#alert-saved .alert').addClass('in');
		alertTimer.start(3);
		setSaveNeeded(false);
	}

	return {
		initialize: initialize,
		load: load,
		settingsChanged: settingsChanged
	};
});