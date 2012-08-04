define([
		'signals',
		'bamboo/bambooRequest',
		'jquery',
        'common/projectView'
	], function (signals, BambooRequest, $, projectView) {

		'use strict';
		
		var on = {
			settingsChanged: new signals.Signal()
		};

		var activeSettings;

		var getVisibleSettings = function () {
			var newSettings = {
				name: activeSettings.name,
				baseUrl: 'bamboo',
				icon: 'bamboo/icon.png',
				url: $('.url-input').val(),
				updateInterval: parseInt($('.update-interval-input').val(), 10),
				username: $('.username-input').val(),
				password: $('.password-input').val(),
				plans: projectView.get().projects
			};
			return newSettings;
		};

		var show = function (settings) {
			projectView.initialize('plan-selection-container');
			if (!settings) {
				throw { name: 'ArgumentUndefined', message: 'settings not defined' };
			}
			updateWithDefaults(settings);
			activeSettings = settings;
			$('.url-input').keyup(urlChanged).change(urlChanged).val(settings.url);
			$('.username-input').val(settings.username);
			$('.password-input').val(settings.password);
			$('.update-interval-input').val(settings.updateInterval);
			$('.plans-button').click(updatePlans);
			$('.save-button').click(function () {
				on.settingsChanged.dispatch(getVisibleSettings());
			});
			$('.settings-form').submit(function () {
				return false;
			});
			urlChanged();
			$('.url-input').focus();
		};

		function urlChanged() {
			var url = $('.url-input').val();
			if (url) {
				$('.plans-button').removeAttr('disabled');
			} else {
				$('.plans-button').attr('disabled', 'disabled');
			}
		}

		var updateWithDefaults = function (settings) {
			if (settings.updateInterval === undefined) {
				settings.updateInterval = 60;
			}
			if (settings.plans === undefined) {
				settings.plans = [];
			}
		};

		var updatePlans = function () {
			if ($('.plans-button').attr('disabled')) {
				return;
			}
			$('.plans-button').attr('disabled', 'disabled');
			$('.plans-button i').addClass('animate');
			$('.alert-error').hide();
			projectView.hide();
			var plansRequest = new BambooRequest(getRequestSettings());
			plansRequest.on.responseReceived.addOnce(function (response) {
				renderPlans(response, activeSettings.plans);
				$('.plans-button i').removeClass('animate');
			});
			plansRequest.on.errorReceived.addOnce(renderError);
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
			$('.plans-button').removeAttr('disabled');
			$('.save-button').removeAttr('disabled');
			var templateData = createTemplateData(response, selectedPlans);
			projectView.show(templateData);
		};

		var renderError = function (ajaxError) {
			$('.plans-button').removeAttr('disabled');
			$('.error-message').text(ajaxError.message);
			$('.error-url').text(ajaxError.url);
			$('.alert-error').show();
			$('.plans-button i').removeClass('animate');
		};

		var createTemplateData = function (response, selectedPlans) {
			var projects = response.projects.project;
			var items = [];
			for (var projectIndex = 0; projectIndex < projects.length; projectIndex++) {
				var project = projects[projectIndex];
				for (var planIndex = 0; planIndex < project.plans.plan.length; planIndex++) {
					var plan = project.plans.plan[planIndex];
					var item = {
						id: plan.key,
						name: plan.shortName,
						group: project.name,
						enabled: plan.enabled,
						selected: selectedPlans.indexOf(plan.key) > -1
					};
					items.push(item);
				}
			}
			return {
				items: items
			};
		};

		return {
			show: show,
			on: on
		};
	});