define([
		'src/bamboo/bambooSettingsController',
		'src/bamboo/bambooRequest',
		'jquery',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json'
	],
	function (controller, BambooRequest, $, jasmineSignals, jsonProjects) {

		describe('BambooSettingsController', function () {

			var settings;
			var mockBambooRequest;
			var spyOnSignal = jasmineSignals.spyOnSignal;

			beforeEach(function () {
				settings = {
					name: 'My Bamboo CI',
					baseUrl: 'src/bamboo',
					service: 'bambooBuildService',
					settingsController: 'bambooSettingsController',
					settingsPage: 'bambooOptions.html',
					url: 'http://example.com/',
					updateInterval: 10,
					username: 'username1',
					password: 'password1',
					plans: ['PROJECT1-PLAN1', 'PROJECT1-PLAN2']
				};
				mockBambooRequest = spyOn(BambooRequest.prototype, 'projects');
				mockBambooRequest.andCallFake(function () {
					this.responseReceived.dispatch(jsonProjects);
				});
				spyOn(window, 'alert');
			});

			function showPlans() {
				jasmine.getFixtures().load('bamboo/settingsFixture.html');
				controller.show(settings);

				$('.plans-button').click();
			}

			it('should initialize from settings', function () {
				jasmine.getFixtures().load('bamboo/settingsFixture.html');

				controller.show(settings);

				expect($('.url-input')).toHaveValue(settings.url);
				expect($('.username-input')).toHaveValue(settings.username);
				expect($('.password-input')).toHaveValue(settings.password);
				expect($('.update-interval-input')).toHaveValue(settings.updateInterval);
			});

			it('should focus on url on load', function () {
				jasmine.getFixtures().load('bamboo/settingsFixture.html');

				controller.show(settings);

				expect($('.url-input:focus').length).toBe(1);
			});

			it('should use url and credentials when getting plans', function () {
				jasmine.getFixtures().load('bamboo/settingsFixture.html');
				mockBambooRequest.andCallFake(function () {
					expect(this.settings.username).toBe(settings.username);
					expect(this.settings.password).toBe(settings.password);
					expect(this.settings.url).toBe(settings.url);
					this.responseReceived.dispatch(jsonProjects);
				});
				controller.show(settings);

				$('.plans-button').click();
			});

			it('should display sorted projects after button clicked', function () {
				showPlans();

				expect($('.plan-selection-container .project').length).toBe(2);
				expect($('.plan-selection-container .project:first a')).toHaveText('Project 1');
				expect($('.plan-selection-container .plan:first span')).toHaveText('Plan 1');
			});

			it('should disable button while waiting for response', function () {
				jasmine.getFixtures().load('bamboo/settingsFixture.html');
				mockBambooRequest.andCallFake(function () {
					expect($('.plans-button')).toBeDisabled();
					this.responseReceived.dispatch(jsonProjects);
				});
				controller.show(settings);

				$('.plans-button').click();

				expect($('.plans-button')).not.toBeDisabled();
				expect(mockBambooRequest).toHaveBeenCalled();
			});

			it('should display error if call failed when getting plans', function () {
				jasmine.getFixtures().load('bamboo/settingsFixture.html');
				mockBambooRequest.andCallFake(function () {
					this.errorReceived.dispatch({ message: 'error message' });
				});
				controller.show(settings);

				$('.plans-button').click();

				expect($('.alert-error')).toBeVisible();
				expect($('.error-message')).toHaveText('error message');
			});

			it('should hide plans when getting new ones', function () {
				showPlans();
				mockBambooRequest.andCallFake(function () {
					this.errorReceived.dispatch({ message: 'error message' });
				});

				$('.plans-button').click();

				expect($('.alert-error')).toBeVisible();
				expect($('.plan-selection-container')).toBeEmpty();
			});

			it('should clear error when getting plans', function () {
				jasmine.getFixtures().load('bamboo/settingsFixture.html');
				controller.show(settings);
				$('.error').show();

				$('.plans-button').click();

				expect($('.error')).not.toBeVisible();
			});

			it('should signal save with settings', function () {
				jasmine.getFixtures().load('bamboo/validSettingsFixture.html');
				controller.show(settings);
				var settingsSavedSpy = spyOnSignal(controller.settingsChanged).matching(function (newSettings) {
					return newSettings.url == settings.url
						&& newSettings.username == settings.username
							&& newSettings.password == settings.password
								&& newSettings.updateInterval == settings.updateInterval
									&& newSettings.plans[0] == 'PROJECT1-PLAN1'
										&& newSettings.plans[1] == 'PROJECT2-PLAN2';
				});

				$('.save-button').click();

				expect(settingsSavedSpy).toHaveBeenDispatched(1);
			});

			it('should indicate disabled plans', function () {
				showPlans();

				expect($('.plan-selection-container #PROJECT1-PLAN2')).toBeVisible();
				expect($('.plan-selection-container #PROJECT1-PLAN2')).toBeChecked();
				expect($('.plan-selection-container #PROJECT1-PLAN2')).toBeDisabled();
			});

			it('should check selected projects', function () {
				showPlans();

				expect($('.plan-selection-container #PROJECT1-PLAN1')).toBeChecked();
			});

			it('should expand projects that have monitored plans', function () {
				showPlans();

				expect($('.plan-selection-container #plans-0.collapse')).toHaveClass('in');
				expect($('.plan-selection-container #plans-1.collapse')).not.toHaveClass('in');
			});

			it('should enable save button after plans loaded', function () {
				showPlans();

				expect($('.save-button')).not.toBeDisabled();
			});

		});
	});