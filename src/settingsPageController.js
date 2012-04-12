define([
		'signals',
		'jquery',
		'./settingsAddController',
		'./settings/savePrompt',
		'./settings/removePrompt',
		'text!./services.ejs',
		'amdUtils/string/format',
		'amdUtils/array/remove',
		'./timer',
		'ejs'
], function (signals, $, settingsAddController, savePrompt, removePrompt, servicesTemplateText, format, remove, Timer) {

	var isInitialized = false;
	var menuTemplate = new EJS({ text: servicesTemplateText });
	var settingsChanged = new signals.Signal();
	var settingsShown = new signals.Signal();
	var settings;
	var currentServiceSettings;
	var alertTimer = new Timer();
	var isSaveNeeded = false;
	var serviceNameElement;
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
			settingsAddController.serviceAdded.add(serviceAdded);
			removePrompt.removeSelected.add(function () {
				removePrompt.hide();
				removeCurrentService();
			});
			serviceList.itemSelected.add(function (index) {
				var serviceName = settings[index].name;
				serviceNameElement.text(serviceName);
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
		settings = [];
		serviceNameElement = $('#service-name');
		$('#service-add-button').click(function () {
			if (!$('#service-add-button').hasClass('disabled')) {
				settingsAddController.show();
			}
		});
		$('#service-remove-button').click(function () {
			removePrompt.show(currentServiceSettings.name);
		});
	}

	function removeCurrentService() {
		setSaveNeeded(false);
		remove(settings, currentServiceSettings);
		serviceList.update();
		var selectedIndex = serviceList.getSelectedIndex();
		serviceList.selectAt(selectedIndex);
		settingsChanged.dispatch(settings);
	}

	var serviceList = {
		itemSelected: new signals.Signal(),
		update: function () {
			menuTemplate.update('service-list', { services: settings });
			$('#service-list li').click(function (event) {
				event.preventDefault();
				serviceList.selectElement(this);
			});
		},
		selectLast: function () {
			$('#service-list li:last').click();
		},
		selectFirst: function () {
			$('#service-list li:first').click();
		},
		getSelectedIndex: function () {
			return settings.indexOf(currentServiceSettings);
		},
		selectAt: function (index) {
			var lastIndex = $('#service-list li:last').index();
			if (this.isEmpty()) {
				this.unselect();
				return;
			}
			if (index > lastIndex) {
				index = lastIndex;
			}
			var menuItem = $('#service-list li').eq(index);
			this.selectElement(menuItem);
		},
		unselect: function () {
			serviceNameElement.text('');
			getIFrame().src = 'about:blank';
		},
		selectElement: function (linkElement) {
			if (isSaveNeeded) {
				savePrompt.show(serviceNameElement.text());
			} else {
				var serviceLink = $(linkElement);
				if (serviceLink.hasClass('active')) return;
				$('#service-list li').removeClass('active');
				serviceLink.addClass('active');

				var index = serviceLink.data('service-index');
				showServicePage(index);
				this.itemSelected.dispatch(index);
			}
		},
		isEmpty: function () {
			var lastIndex = $('#service-list li:last').index();
			return lastIndex < 0;
		}
	};

	function getIFrame() {
		return $('#settings-frame')[0];
	}

	function load(newSettings) {
		settings = newSettings;
		serviceList.update();
		serviceList.selectFirst();
	}

	function showServicePage(index) {
		var serviceSettings = settings[index];
		currentServiceSettings = serviceSettings;
		serviceNameElement.text(serviceSettings.name);
		var iframe = getIFrame();
		iframe.onload = function () {
			settingsShown.dispatch();
			var controllerName = serviceSettings.baseUrl + '/' + serviceSettings.settingsController;
			iframe.contentWindow.require([controllerName], function (serviceSettingsController) {
				// executed in iframe context
				serviceSettingsController.settingsChanged.add(serviceSettingsChanged);
				serviceSettingsController.show(serviceSettings);
			});
		};
		iframe.src = format('{0}/{1}', serviceSettings.baseUrl, serviceSettings.settingsPage);

		function serviceSettingsChanged(updatedSettings) {
			settings[index] = updatedSettings;
			settingsChanged.dispatch(settings);
			$('#alert-saved .alert').addClass('in');
			alertTimer.start(3);
		}
	}

	function serviceAdded(serviceInfo) {
		settings.push(serviceInfo);
		serviceList.update();
		serviceList.selectLast();
		setSaveNeeded(true);
	}

	return {
		initialize: initialize,
		load: load,
		settingsShown: settingsShown,
		settingsChanged: settingsChanged
	};
});