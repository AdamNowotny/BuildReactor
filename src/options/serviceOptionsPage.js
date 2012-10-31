// testcomment
define([
	'signals',
	'jquery',
	'options/settingsFormView',
	'options/projectView',
	'common/resourceFinder'
], function (signals, $, settingsFormView, projectView, resourceFinder) {

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
		settingsFormView.on.changed.add(settingsChanged);
		settingsFormView.on.clickedShow.add(showProjects);
	};
	
	function showProjects(currentValues) {
		projectView.hide();
		$('.alert-error').hide();
		var settings = {
			baseUrl: currentServiceInfo.baseUrl,
			url: currentValues.url,
			username: currentValues.username,
			password: currentValues.password,
			projects: currentServiceInfo.projects
		};
		var message = {
			name: 'availableProjects',
			serviceSettings: settings
		};
		chrome.extension.sendMessage(message, function (response) {
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

	function settingsChanged(currentSettings) {
		on.updated.dispatch({
			name: currentServiceInfo.name,
			baseUrl: currentServiceInfo.baseUrl,
			url: currentSettings.url,
			icon: currentServiceInfo.icon,
			updateInterval: currentSettings.updateInterval,
			username: currentSettings.username,
			password: currentSettings.password,
			projects: projectView.get().projects
		});
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