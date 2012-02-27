define([
		'jquery',
		'settingsAddController',
		'text!services.ejs',
		'signals',
		'stringExtensions',
		'ejs'
], function ($, settingsAddController, servicesTemplateText, signals) {

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
		$('#service-list a:first').click();
	}

	function updateMenu() {
		menuTemplate.update('service-list', { services: activeSettings });
		$('#service-list a').click(serviceClick);
	}

	function serviceClick(event) {
		event.preventDefault();
		var serviceLink = $(this);
		if (serviceLink.hasClass('active')) return;
		$('#service-list a').removeClass('active');
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
			var controllerName = serviceSettings.settingsController;
			iframe.contentWindow.require([controllerName], function (serviceSettingsController) {
				// executed in iframe context
				serviceSettingsController.saveClicked.add(saveClicked);
				serviceSettingsController.show(serviceSettings);
			});
		};
		iframe.src = '{0}/{1}'.format(serviceSettings.baseUrl, serviceSettings.settingsPage);

		function saveClicked(updatedSettings) {
			activeSettings[index] = updatedSettings;
			settingsChanged.dispatch(activeSettings);
		}
	}

	function serviceAdded(serviceInfo) {
		activeSettings.push(serviceInfo);
		updateMenu();
		$('#service-list a:last').click();
	}

	return {
		initialize: initialize,
		load: load,
		settingsShown: settingsShown,
		settingsChanged: settingsChanged
	};
});