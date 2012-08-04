define([
	'signals',
	'jquery',
	'cctray/ccRequest',
	'common/projectView'
], function (signals, $, ccRequest, projectView) {

		'use strict';

		var on = {
			settingsChanged: new signals.Signal()
		};
		var activeSettings;

		function getVisibleSettings() {
			var newSettings = {
				name: activeSettings.name,
				baseUrl: 'cctray',
				url: $('.url-input').val(),
				icon: 'cctray/icon.png',
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
			$('.url-input').keyup(urlChanged).change(urlChanged).val(settings.url);
			$('.username-input').val(settings.username);
			$('.password-input').val(settings.password);
			$('.update-interval-input').val(settings.updateInterval);
			$('.projects-button').click(updatePlans);
			$('.save-button').click(function () {
				on.settingsChanged.dispatch(getVisibleSettings());
			});
			$('.settings-form').submit(function () {
				return false;
			});
			urlChanged();
			$('.url-input').focus();
		}

		function urlChanged() {
			var url = $('.url-input').val();
			if (url) {
				$('.projects-button').removeAttr('disabled');
			} else {
				$('.projects-button').attr('disabled', 'disabled');
			}
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
			if ($('.projects-button').attr('disabled')) {
				return;
			}
			$('.projects-button').attr('disabled', 'disabled');
			$('.projects-button i').addClass('animate');
			$('.alert-error').hide();
			projectView.hide();
			var plansRequest = ccRequest.projects(getRequestSettings());
			plansRequest.responseReceived.addOnce(function (response) {
				renderPlans(response, activeSettings.projects);
				$('.projects-button i').removeClass('animate');
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
			var templateData = createTemplateData(projectsXml, selectedProjects);
			projectView.show(templateData);
		}

		function renderError(ajaxError) {
			$('.projects-button').removeAttr('disabled');
			$('.error-message').text(ajaxError.message);
			$('.error-url').text(ajaxError.url);
			$('.alert-error').show();
			$('.projects-button i').removeClass('animate');
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
			on: on
		};
	});