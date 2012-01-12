define([
		'jquery',
		'text!./services.ejs',
		'signals'
], function ($, servicesTemplateText, signals) {

	var menuTemplate = new EJS({ text: servicesTemplateText });
	var settingsChanged = new signals.Signal();
	var settingsShown = new signals.Signal();

	function show(settings) {
		showMenu(settings);
		$('#service-list a:first').click();

		function showMenu() {
			menuTemplate.update('service-list', { services: settings });
			$('#service-list a').click(serviceClick);
		}

		function serviceClick(event) {
			event.preventDefault();
			var serviceLink = $(this);
			if (serviceLink.hasClass('active')) return;
			$('#service-list a').removeClass('active');
			serviceLink.addClass('active');
			var index = serviceLink.data('service-index');
			var serviceSettings = settings[index];
			showServicePage(serviceSettings);

			function showServicePage(serviceSettings) {
				$('#service-name').text(serviceSettings.name);
				var iframe = $('#settings-frame')[0];
				iframe.onload = function () {
					var controllerName = serviceSettings.settingsController;
					iframe.contentWindow.require([controllerName], function (serviceSettingsController) {
						// executed in iframe context
						serviceSettingsController.saveClicked.add(saveClicked);
						serviceSettingsController.show(serviceSettings);
					});
				};
				iframe.src = '{0}/{1}'.format(serviceSettings.baseUrl, serviceSettings.settingsPage);
				settingsShown.dispatch();

				function saveClicked(updatedSettings) {
					serviceSettings = updatedSettings;
					settingsChanged.dispatch(settings);
				}
			}
		}

	}

	return {
		show: show,
		settingsShown: settingsShown,
		settingsChanged: settingsChanged
	};
});