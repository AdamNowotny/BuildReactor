define([
		'signals',
		'./bambooRequest',
		'jquery',
		'text!./planSelection.ejs'
	], function (signals, BambooRequest, $, planSelectionText) {

		var planSelectionTemplate = new EJS({ text: planSelectionText });
		var saveClicked = new signals.Signal();

		function show(settings) {
			Contract.expectObject(settings, 'settings not defined');
			$('.url-input').val(settings.url);
			$('.username-input').val(settings.username);
			$('.password-input').val(settings.password);
			$('.update-interval-input').val(settings.updateInterval);
			$('.plans-button').click(updatePlans);
			$('.save-button').click(save);
			$('.bamboo-settings-form').submit(function () {
				return false;
			});

			function save() {
				var plans = $('.plan-selection-container .plan input:checked').map(function () {
					return this.name;
				}).get();
				var newSettings = {
					name: settings.name,
					baseUrl: 'src/bamboo',
					service: 'bambooBuildService',
					settingsController: 'bambooSettingsController',
					settingsPage: 'bambooOptions.html',
					url: $('.url-input').val(),
					username: $('.username-input').val(),
					password: $('.password-input').val(),
					updateInterval: parseInt($('.update-interval-input').val()),
					plans: plans
				};
				alert('Settings saved');
				saveClicked.dispatch(newSettings);
			};

			function updatePlans() {
				$('.plans-button').attr('disabled', 'disabled');
				$('.alert-error').hide();
				var plansRequest = new BambooRequest(getRequestSettings());
				plansRequest.responseReceived.addOnce(function (response) {
					response.projects.project.sort(function (a, b) {
						return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
					});
					renderPlans(response);
				});
				plansRequest.errorReceived.addOnce(renderError);
				plansRequest.projects();

				function getRequestSettings() {
					var baseUrl = $('.url-input').val();
					var username = $('.username-input').val();
					var password = $('.password-input').val();
					return {
						url: baseUrl,
						username: username,
						password: password
					};
				}

				function renderPlans(response) {
					console.log('BambooSettingsController: Plans received', response);
					$('.plans-button').removeAttr('disabled');
					$('.save-button').removeAttr('disabled');
					var projectsHtml = planSelectionTemplate.render({
						projects: response.projects.project,
						selectedPlans: settings.plans
					});
					$('.plan-selection-container').html(projectsHtml);
					$('.plan-selection-container .plan input:checked').each(function () {
						$(this).closest('.collapse').addClass('in');
					});
				}

				function renderError(ajaxError) {
					console.error('BambooSettingsController: Ajax request failed: ' + ajaxError.message, ajaxError);
					$('.plans-button').removeAttr('disabled');
					$('.error-message').text(ajaxError.message);
					$('.alert-error').show();
				}
			}
		};

		return {
			show: show,
			saveClicked: saveClicked
		};
	});