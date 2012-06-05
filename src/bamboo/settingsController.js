define([
		'signals',
		'./bambooRequest',
		'jquery',
        '../common/projectView'
	], function (signals, BambooRequest, $, projectView) {

		var settingsChanged = new signals.Signal();
		var activeSettings;

		var getVisibleSettings = function () {
			var newSettings = {
				name: activeSettings.name,
				baseUrl: 'src/bamboo',
				url: $('.url-input').val(),
				updateInterval: parseInt($('.update-interval-input').val()),
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
		    projectView.hide();
			var plansRequest = new BambooRequest(getRequestSettings());
			plansRequest.responseReceived.addOnce(function (response) {
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
			projectView.show(templateData);
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
			};;
		};

		return {
			show: show,
			settingsChanged: settingsChanged
		};
	});