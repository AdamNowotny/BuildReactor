define([
		'signals',
		'jquery',
		'./settingsAddController',
		'text!./services.ejs',
		'amdUtils/string/format',
		'ejs'
], function (signals, $, settingsAddController, servicesTemplateText, format) {

	var menuTemplate = new EJS({ text: servicesTemplateText });
	var settingsChanged = new signals.Signal();
	var settingsShown = new signals.Signal();
	var activeSettings;

	function initialize() {
		activeSettings = [];
		settingsAddController.initialize();
		settingsAddController.serviceAdded.add(serviceAdded);
		$('#service-add-button').click(function () {
			settingsAddController.show();
		});
	};

	function load(settings) {
		activeSettings = settings;
		updateMenu();
		$('#service-list li:first').click();
	}

	function updateMenu() {
		menuTemplate.update('service-list', { services: activeSettings });
		$('#service-list li').click(serviceClick);
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

	function showServicePage(index) {
		var serviceSettings = activeSettings[index];
		$('#service-name').text(serviceSettings.name);
		var iframe = $('#settings-frame')[0];
		iframe.onload = function () {
			settingsShown.dispatch();
			//var controllerName = serviceSettings.baseUrl + '/' + serviceSettings.settingsController;
			var controllerName = serviceSettings.baseUrl + '/' + serviceSettings.settingsController;
			iframe.contentWindow.require([controllerName], function (serviceSettingsController) {
				// executed in iframe context
				serviceSettingsController.saveClicked.add(saveClicked);
				serviceSettingsController.show(serviceSettings);
			});
		};
		iframe.src = format('{0}/{1}', serviceSettings.baseUrl, serviceSettings.settingsPage);

		function saveClicked(updatedSettings) {
			activeSettings[index] = updatedSettings;
			settingsChanged.dispatch(activeSettings);
		}
	}

	function serviceAdded(serviceInfo) {
		activeSettings.push(serviceInfo);
		updateMenu();
		$('#service-list li:last').click();
	}

	return {
		initialize: initialize,
		load: load,
		settingsShown: settingsShown,
		settingsChanged: settingsChanged
	};
});