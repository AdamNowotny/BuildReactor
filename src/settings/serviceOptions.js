define([
	'signals',
	'jquery',
	'settings/settingsFormView',
	'settings/projectView'
], function (signals, $, settingsFormView, projectView) {

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
			return showEmpty();
		}
		if (serviceInfo === currentServiceInfo) {
			return;
		}
		updateWithDefaults(serviceInfo);
		currentServiceInfo = serviceInfo;
		projectView.hide();
		settingsFormView.show({
			url: serviceInfo.url,
			updateInterval: serviceInfo.updateInterval,
			username: serviceInfo.username,
			password: serviceInfo.password
		});
		settingsFormView.on.changed.add(settingsChanged);
		settingsFormView.on.clickedShow.add(function req(currentValues) {
			projectView.hide();
			$('.alert-error').hide();
			var serviceModuleName = serviceInfo.baseUrl + '/buildService';
			require([serviceModuleName], function (BuildService) {
				var settings = {
					url: currentValues.url,
					username: currentValues.username,
					password: currentValues.password
				};
				var service = new BuildService(settings);
				var result = service.projects(serviceInfo.projects);
				result.receivedProjects.addOnce(projectsReceived);
				result.errorThrown.addOnce(renderError);
			});
		});
	};
	
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

	var showEmpty = function () {
		settingsFormView.hide();
		projectView.hide();
	};

	return {
		initialize: initialize,
		show: show,
		on: on
	};
});