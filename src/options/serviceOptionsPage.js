define([
	'signals',
	'jquery',
	'mout/object/fillIn',
	'options/settingsFormView',
	'options/projectView',
	'options/messages'
], function (signals, $, fillIn, settingsFormView, projectView, messages) {

	'use strict';

	var on = {
			updated: new signals.Signal()
		},
		currentServiceInfo;

	function initialize() {
		projectView.initialize('project-selection-container');
		settingsFormView('.settings-form-container');
	}

	var show = function (serviceInfo) {
		if (!serviceInfo) {
			throw { name: 'ArgumentInvalid', message: 'serviceInfo is undefined' };
		}
		if (serviceInfo === currentServiceInfo) {
			return;
		}
		updateWithDefaults(serviceInfo);
		currentServiceInfo = serviceInfo;
		projectView.hide();
		$('.alert-error').hide();
		settingsFormView.show(serviceInfo);
		settingsFormView.on.changed.add(function (currentValues) {
			var newSettings = fillIn(currentValues, currentServiceInfo);
			newSettings.projects = projectView.get().projects;
			on.updated.dispatch(newSettings);
		});
		settingsFormView.on.clickedShow.add(showProjects);
	};

	function showProjects(currentValues) {
		projectView.hide();
		$('.alert-error').hide();
		var message = {
			name: 'availableProjects',
			serviceSettings: fillIn(currentValues, currentServiceInfo)
		};
		messages.send(message, function (response) {
			if (response.error) {
				renderError(response.error);
			} else {
				projectsReceived(response.projects);
			}
		});
	}

	function projectsReceived(projects) {
		projectView.show(projects);
		settingsFormView.resetButtons();
	}

	function renderError(ajaxError) {
		settingsFormView.resetButtons();
		$('.error-message').text(ajaxError.message);
		$('.error-url').text(ajaxError.url);
		$('.alert-error').show();
	}

	var updateWithDefaults = function (serviceInfo) {
		if (serviceInfo.updateInterval === undefined) {
			serviceInfo.updateInterval = 60;
		}
		if (serviceInfo.projects === undefined) {
			serviceInfo.projects = [];
		}
	};

	var hide = function () {
		settingsFormView.hide();
		projectView.hide();
		$('.alert-error').hide();
		currentServiceInfo = null;
	};

	return {
		initialize: initialize,
		show: show,
		hide: hide,
		on: on
	};
});