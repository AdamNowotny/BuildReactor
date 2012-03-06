define([
		'signals',
		'jquery',
		'./settingsAddController',
		'text!./services.ejs',
		'amdUtils/string/format',
		'amdUtils/array/remove',
		'ejs'
], function (signals, $, settingsAddController, servicesTemplateText, format, remove) {

	var menuTemplate = new EJS({ text: servicesTemplateText });
	var settingsChanged = new signals.Signal();
	var settingsShown = new signals.Signal();
	var settings;
	var currentServiceSettings;

	function initialize() {
		settings = [];
		settingsAddController.initialize();
		settingsAddController.serviceAdded.add(serviceAdded);
		$('#service-add-button').click(settingsAddController.show);
		$('#service-remove-button').click(serviceRemoveModal.show);
		$('#service-remove-form').submit(function () {
			serviceRemoveModal.remove();
			return false;
		});
	};

	var serviceRemoveModal = {
		show: function () {
			$('#service-remove-name').text(currentServiceSettings.name);
			$('#service-remove-modal').modal();
		},
		remove: function () {
			$('#service-remove-modal').modal('hide');
			var selectedIndex = serviceList.getSelectedIndex();
			remove(settings, currentServiceSettings);
			serviceList.update();
			serviceList.selectAt(selectedIndex);
			settingsChanged.dispatch(settings);
		}
	};

	var serviceList = {
		update: function () {
			menuTemplate.update('service-list', { services: settings });
			$('#service-list li').click(serviceClick);
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
			if (lastIndex < 0) {
				this.unselect();
				return;
			}
			if (index > lastIndex) {
				index = lastIndex;
			}
			$('#service-list li').eq(index).click();
		},
		unselect: function () {
			$('#service-name').text('');
			getIFrame().src = 'about:blank';
		}
	};

	function load(newSettings) {
		settings = newSettings;
		serviceList.update();
		serviceList.selectFirst();
	}

	function serviceClick(event) {
		event.preventDefault();
		var serviceLink = $(this);
		if (serviceLink.hasClass('active')) return;
		$('#service-list li').removeClass('active');
		serviceLink.addClass('active');

		var index = serviceLink.data('service-index');
		showServicePage(index);
	}

	function getIFrame() {
		return $('#settings-frame')[0];
	}

	function showServicePage(index) {
		var serviceSettings = settings[index];
		currentServiceSettings = serviceSettings;
		$('#service-name').text(serviceSettings.name);
		var iframe = getIFrame();
		iframe.onload = function () {
			settingsShown.dispatch();
			var controllerName = serviceSettings.baseUrl + '/' + serviceSettings.settingsController;
			iframe.contentWindow.require([controllerName], function (serviceSettingsController) {
				// executed in iframe context
				serviceSettingsController.saveClicked.add(saveClicked);
				serviceSettingsController.show(serviceSettings);
			});
		};
		iframe.src = format('{0}/{1}', serviceSettings.baseUrl, serviceSettings.settingsPage);

		function saveClicked(updatedSettings) {
			settings[index] = updatedSettings;
			settingsChanged.dispatch(settings);
		}
	}

	function serviceAdded(serviceInfo) {
		settings.push(serviceInfo);
		serviceList.update();
		serviceList.selectLast();
	}

	return {
		initialize: initialize,
		load: load,
		settingsShown: settingsShown,
		settingsChanged: settingsChanged
	};
});