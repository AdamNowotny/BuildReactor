define([
		'jquery',
		'text!./services.ejs',
		'text!./settings.ejs',
        'signals'
], function ($, servicesTemplateText, settingsTemplateText, signals) {

    var navigationTemplate = new EJS({ text: servicesTemplateText });
    var settingsTemplate = new EJS({ text: settingsTemplateText });
    var settingsChanged = new signals.Signal();

    function show(settingsList) {

        navigationTemplate.update('services', { services: settingsList });
        $('#services a').click(showServiceSettings);
        settingsTemplate.update('settings-container', { services: settingsList });
        $('#services a:first').click();

        function showServiceSettings(event) {
            event.preventDefault();
            var serviceLink = $(this);
            if (serviceLink.hasClass('active')) return;
            $('#services a').removeClass('active');
            serviceLink.addClass('active');

            var index = serviceLink.data('service-index');
            var contentDivId = 'settings-' + index;
            var settings = settingsList[index];
            var controllerName = settings.settingsController;
            require([controllerName], function (Controller) {
                var controllerInstance = new Controller(settings);
                controllerInstance.saveClicked.add(saveClicked);
                controllerInstance.show(contentDivId);
                $('.settings').hide();
                $('#' + contentDivId).show();
            });

            function saveClicked(updatedSettings) {
                settingsList[index] = updatedSettings;
                settingsChanged.dispatch(settingsList);
            }

        }
    }

    return {
        show: show,
        settingsChanged: settingsChanged
    };
});