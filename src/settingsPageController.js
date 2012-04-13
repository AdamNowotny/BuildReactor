define([
		'signals',
		'jquery',
		'./settings/serviceSettings',
		'./settingsAddController',
		'./settings/serviceList',
		'./settings/savePrompt',
		'./settings/removePrompt',
		'./timer'
], function (signals, $, serviceSettings, settingsAddController, serviceList, savePrompt, removePrompt, Timer) {

	var isInitialized = false;
	var settingsChanged = new signals.Signal();
	var settingsShown = new signals.Signal();
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

	function initialize() {
		if (!isInitialized) {
			savePrompt.removeSelected.add(function () {
				removeCurrentService();
				savePrompt.hide();
			});
			settingsAddController.serviceAdded.add(function (serviceInfo) {
				serviceSettings.add(serviceInfo);
				serviceList.add(serviceInfo);
				setSaveNeeded(true);
			});
			removePrompt.removeSelected.add(function () {
				removePrompt.hide();
				removeCurrentService();
			});
			serviceSettings.cleared.add(function () {
				serviceNameElement.text('');
				getIFrame().src = 'about:blank';
			});
			serviceList.itemClicked.add(function (item) {
				if (isSaveNeeded) {
					savePrompt.show(serviceList.getSelectedName());
				} else {
					serviceList.selectItem(item);
				}
			});
			serviceList.itemSelected.add(function (item) {
				serviceNameElement.text($(item).text());
				var index = item.data('service-index');
				var serviceInfo = serviceSettings.getByIndex(index);
				showServicePage(serviceInfo);
			});
			isInitialized = true;
		}
		reset();
	};

	function reset() {
		savePrompt.initialize();
		settingsAddController.initialize();
		removePrompt.initialize();
		setSaveNeeded(false);
		serviceSettings.clear();
		serviceNameElement = $('#service-name');
		$('#service-add-button').click(function () {
			if (!$('#service-add-button').hasClass('disabled')) {
				settingsAddController.show();
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

	function getIFrame() {
		return $('#settings-frame')[0];
	}

	function load(newSettings) {
		serviceSettings.load(newSettings);
		serviceList.load(serviceSettings.getAll());
	}

	function showServicePage(serviceInfo) {
		current = serviceInfo;
		var iframe = getIFrame();
		iframe.onload = function () {
			settingsShown.dispatch();
			var controllerName = serviceInfo.baseUrl + '/' + serviceInfo.settingsController;
			iframe.contentWindow.require([controllerName], function (serviceSettingsController) {
				// executed in iframe context
				serviceSettingsController.settingsChanged.add(serviceSettingsChanged);
				serviceSettingsController.show(serviceInfo);
			});
		};
		iframe.src = serviceInfo.baseUrl + '/' + serviceInfo.settingsPage;

		function serviceSettingsChanged(updatedSettings) {
			serviceSettings.load(updatedSettings);
			settingsChanged.dispatch(serviceSettings.getAll());
			$('#alert-saved .alert').addClass('in');
			alertTimer.start(3);
		}
	}

	return {
		initialize: initialize,
		load: load,
		settingsShown: settingsShown,
		settingsChanged: settingsChanged
	};
});