define([
		'signals',
		'./bambooRequest',
		'jquery',
		'text!./planSelection.hbs',
		'handlebars'
	], function (signals, BambooRequest, $, planSelectionText, handlebars) {

		var planSelectionTemplate = handlebars.compile(planSelectionText);
		var settingsChanged = new signals.Signal();
		var activeSettings;

		var getVisibleSettings = function () {
			var plans = $('.plan-selection-container .plan input:checked').map(function () {
				return this.name;
			}).get();
			var newSettings = {
				name: activeSettings.name,
				baseUrl: 'src/bamboo',
				url: $('.url-input').val(),
				updateInterval: parseInt($('.update-interval-input').val()),
				username: $('.username-input').val(),
				password: $('.password-input').val(),
				plans: plans
			};
			return newSettings;
		};

		var show = function(settings) {
			if (!settings) {
				throw { name: 'ArgumentUndefined', message: 'settings not defined' };
			}
			updateWithDefaults(settings);
			activeSettings = settings;
			$('.url-input').val(settings.url);
			$('.username-input').val(settings.username);
			$('.password-input').val(settings.password);
			$('.update-interval-input').val(settings.updateInterval);
			$('.plans-button').click(updatePlans);
			$('.save-button').click(function() {
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
			if (settings.plans === undefined) {
				settings.plans = [];
			}
		};

		var updatePlans = function () {
			$('.plans-button').attr('disabled', 'disabled');
			$('.alert-error').hide();
			$('.plan-selection-container').html('');
			var plansRequest = new BambooRequest(getRequestSettings());
			plansRequest.responseReceived.addOnce(function (response) {
				response.projects.project.sort(function (a, b) {
					return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
				});
				renderPlans(response, activeSettings.plans);
			});
			plansRequest.errorReceived.addOnce(renderError);
			plansRequest.projects();
		};

		var getRequestSettings = function () {
			var baseUrl = $('.url-input').val();
			var username = $('.username-input').val();
			var password = $('.password-input').val();
			return {
				url: baseUrl,
				username: username,
				password: password
			};
		};

		var renderPlans = function (response, selectedPlans) {
			console.log('bamboo/settingsController: Plans received', response);
			$('.plans-button').removeAttr('disabled');
			$('.save-button').removeAttr('disabled');
			var templateData = createTemplateData(response, selectedPlans);
			var projectsHtml = planSelectionTemplate(templateData);
			$('.plan-selection-container').html(projectsHtml);
			$('.plan-selection-container .plan input:checked').each(function () {
				$(this).closest('.collapse').addClass('in');
			});
		};

		var renderError = function (ajaxError) {
			console.error('bamboo/settingsController: Ajax request failed: ' + ajaxError.message, ajaxError);
			$('.plans-button').removeAttr('disabled');
			$('.error-message').text(ajaxError.message);
			$('.error-url').text(ajaxError.url);
			$('.alert-error').show();
		};

		var createTemplateData = function (response, selectedPlans) {
			var projects = response.projects.project;
			var data = {
				projects: []
			};
			for (var projectIndex = 0; projectIndex < projects.length; projectIndex++) {
				var project = projects[projectIndex];
				var dataProject = {
					name: project.name,
					index: projectIndex,
					plans: []
				};
				for (var planIndex = 0; planIndex < project.plans.plan.length; planIndex++) {
					var plan = project.plans.plan[planIndex];
					var dataPlan = {
						name: plan.shortName,
						key: plan.key,
						enabled: plan.enabled,
						selected: selectedPlans.indexOf(plan.key) > -1
					};
					dataProject.plans.push(dataPlan);
				}
				data.projects.push(dataProject);
			}
			return data;
		};

		return {
			show: show,
			settingsChanged: settingsChanged
		};
	});