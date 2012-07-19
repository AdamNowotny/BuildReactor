define([
	'signals',
	'jquery',
	'cctray/ccRequest',
	'common/projectView'
], function (signals, $, ccRequest, projectView) {

		'use strict';

		var settingsChanged = new signals.Signal(),
			activeSettings;

		function getVisibleSettings() {
			var newSettings = {
				name: activeSettings.name,
				baseUrl: 'cctray',
				url: $('.url-input').val(),
				updateInterval: parseInt($('.update-interval-input').val(), 10),
				username: $('.username-input').val(),
				password: $('.password-input').val(),
				projects: projectView.get().projects
			};
			return newSettings;
		}

		function show(settings) {
			projectView.initialize('project-selection-container');
			if (!settings) {
				throw { name: 'ArgumentUndefined', message: 'settings not defined' };
			}
			updateWithDefaults(settings);
			activeSettings = settings;
			$('.url-input').val(settings.url);
			$('.username-input').val(settings.username);
			$('.password-input').val(settings.password);
			$('.update-interval-input').val(settings.updateInterval);
			$('.projects-button').click(updatePlans);
			$('.save-button').click(function () {
				settingsChanged.dispatch(getVisibleSettings());
			});
			$('.settings-form').submit(function () {
				return false;
			});
			$('.url-input').focus();
		}

		function updateWithDefaults(settings) {
			if (settings.updateInterval === undefined) {
				settings.updateInterval = 60;
			}
			if (settings.projects === undefined) {
				settings.projects = [];
			}
		}

		function updatePlans() {
			$('.projects-button').attr('disabled', 'disabled');
			$('.alert-error').hide();
			projectView.hide();
			var plansRequest = ccRequest.projects(getRequestSettings());
			plansRequest.responseReceived.addOnce(function (response) {
				renderPlans(response, activeSettings.projects);
			});
			plansRequest.errorReceived.addOnce(renderError);
		}

		function getRequestSettings() {
			return {
				url: $('.url-input').val(),
				username: $('.username-input').val(),
				password: $('.password-input').val()
			};
		}

		function renderPlans(projectsXml, selectedProjects) {
			$('.projects-button').removeAttr('disabled');
			$('.save-button').removeAttr('disabled');
			console.log('cruisecontrol/settingsController: Plans received', projectsXml);
			var templateData = createTemplateData(projectsXml, selectedProjects);
			projectView.show(templateData);
		}

		function renderError(ajaxError) {
			console.error('BambooSettingsController: Ajax request failed: ' + ajaxError.message, ajaxError);
			$('.plans-button').removeAttr('disabled');
			$('.error-message').text(ajaxError.message);
			$('.error-url').text(ajaxError.url);
			$('.alert-error').show();
		}

		function createTemplateData(projectsXml, selectedProjects) {
			
			function createItem(i, d) {
				var item = $(d),
					projectName = item.attr('name');
				return {
					id: projectName,
					name: projectName,
					group: item.attr('category'),
					enabled: true,
					selected: selectedProjects.indexOf(projectName) > -1
				};
			}

			var items = $(projectsXml)
				.find('Project')
				.map(createItem)
				.toArray();
			return {
				items: items
			};
		}

		return {
			show: show,
			settingsChanged: settingsChanged
		};
	});