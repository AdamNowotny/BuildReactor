define([
		'signals',
		'jquery',
		'./ccRequest',
		'./projectView'
	], function (signals, $, ccRequest, projectView) {

		var settingsChanged = new signals.Signal();
		var activeSettings;
		projectView.initialize('project-selection-container');
	    
		var getVisibleSettings = function () {
			var newSettings = {
				name: activeSettings.name,
				baseUrl: 'src/cruisecontrol',
				url: $('.url-input').val(),
				updateInterval: parseInt($('.update-interval-input').val()),
				username: $('.username-input').val(),
				password: $('.password-input').val(),
				projects: projectView.get().projects
			};
			return newSettings;
		};

		var show = function (settings) {
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
		};

		var updateWithDefaults = function (settings) {
			if (settings.updateInterval === undefined) {
				settings.updateInterval = 60;
			}
			if (settings.projects === undefined) {
				settings.projects = [];
			}
		};

		var updatePlans = function () {
			$('.projects-button').attr('disabled', 'disabled');
			$('.alert-error').hide();
			projectView.hide();
			var plansRequest = ccRequest.projects(getRequestSettings());
			plansRequest.responseReceived.addOnce(function (response) {
				renderPlans(response, activeSettings.projects);
			});
			plansRequest.errorReceived.addOnce(renderError);
		};

		var getRequestSettings = function () {
			return {
			    url: $('.url-input').val(),
			    username: $('.username-input').val(),
			    password: $('.password-input').val()
			};
		};

		var renderPlans = function (responseJson, selectedProjects) {
			$('.projects-button').removeAttr('disabled');
			$('.save-button').removeAttr('disabled');
			console.log('cruisecontrol/settingsController: Plans received', responseJson);
			var templateData = createTemplateData(responseJson, selectedProjects);
			projectView.show(templateData);
		};

		var renderError = function (ajaxError) {
			console.error('BambooSettingsController: Ajax request failed: ' + ajaxError.message, ajaxError);
			$('.plans-button').removeAttr('disabled');
			$('.error-message').text(ajaxError.message);
			$('.error-url').text(ajaxError.url);
			$('.alert-error').show();
		};

		var createTemplateData = function (response, selectedProjects) {
			var items = [];
			for (var index = 0; index < response.Project.length; index++) {
				var project = response.Project[index];
				var item = {
				    id: index,
					name: project.name,
					group: project.category,
					enabled: true,
					selected: selectedProjects.indexOf(project.name) > -1
				};
				items.push(item);
			};
			return {
			    items: items
			};
		};

		return {
			show: show,
			settingsChanged: settingsChanged
		};
	});