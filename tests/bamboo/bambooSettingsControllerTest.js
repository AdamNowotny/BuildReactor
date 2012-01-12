define([
	'src/bamboo/bambooSettingsController',
	'src/bamboo/bambooRequest',
	'SignalLogger',
	'jquery',
	'json!testdata/bamboo/projects.json'
	],
	function (controller, BambooRequest, SignalLogger, $, jsonProjects) {

		describe('BambooSettingsController', function () {

			var settings;
			var logger;
			var mockBambooRequest;

			beforeEach(function () {
				settings = {
					name: 'My Bamboo CI',
					username: 'username1',
					password: 'password1',
					url: 'http://example.com/',
					updateInterval: 10,
					plans: ['PROJECT1-PLAN1', 'PROJECT1-PLAN2']
				};
				logger = new SignalLogger({
					saveClicked: controller.saveClicked
				});
				mockBambooRequest = spyOn(BambooRequest.prototype, 'projects');
				mockBambooRequest.andCallFake(function () {
					this.responseReceived.dispatch(jsonProjects);
				});
				spyOn(window, 'alert');
			});

			it('should initialize from settings', function () {
				jasmine.getFixtures().load('bamboo/settings.html');

				controller.show(settings);

				expect($('.url-input')).toHaveValue(settings.url);
				expect($('.username-input')).toHaveValue(settings.username);
				expect($('.password-input')).toHaveValue(settings.password);
				expect($('.update-interval-input')).toHaveValue(settings.updateInterval);
			});

			function showPlans() {
				jasmine.getFixtures().load('bamboo/settings.html');
				controller.show(settings);

				$('.plans-button').click();
			}

			it('should use url and credentials when getting plans', function () {
				jasmine.getFixtures().load('bamboo/settings.html');
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
				expect($('.plan-selection-container .project:first')).toHaveText('Project 1');
				expect($('.plan-selection-container .plans .plan:first label')).toHaveText('Plan 1');
			});

			it('should render plans for projects after button clicked', function () {
				showPlans();

				expect($('.plan-selection-container .project + .plans')).toContain('.plan');
			});

			it('should disable button while waiting for response', function () {
				jasmine.getFixtures().load('bamboo/settings.html');
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
				jasmine.getFixtures().load('bamboo/settings.html');
				mockBambooRequest.andCallFake(function () {
					this.errorReceived.dispatch({ message: 'error message' });
				});
				controller.show(settings);

				$('.plans-button').click();

				expect($('.error')).toBeVisible();
				expect($('.error-message')).toHaveText('error message');
			});

			it('should clear error when getting plans', function () {
				jasmine.getFixtures().load('bamboo/settings.html');
				controller.show(settings);
				$('.error').show();

				$('.plans-button').click();

				expect($('.error')).not.toBeVisible();
			});

			it('should signal save with settings', function () {
				jasmine.getFixtures().load('bamboo/validSettings.html');
				controller.show(settings);
				logger.saveClicked.setFilter(function (newSettings) {
					return newSettings.url == settings.url
						&& newSettings.username == settings.username
							&& newSettings.password == settings.password
								&& newSettings.updateInterval == settings.updateInterval
									&& newSettings.plans[0] == 'PROJECT1-PLAN1'
										&& newSettings.plans[1] == 'PROJECT2-PLAN2';
				});

				$('.save-button').click();

				expect(logger.saveClicked.count).toBe(1);
			});

			it('should indicate disabled plans', function () {
				showPlans();

				expect($('.plan-selection-container #PROJECT1-PLAN2')).toBeVisible();
				expect($('.plan-selection-container #PROJECT1-PLAN2')).toBeChecked();
				expect($('.plan-selection-container #PROJECT1-PLAN2').closest('.plan')).toHaveClass('disabled');
			});

			it('should check selected projects', function () {
				showPlans();

				expect($('.plan-selection-container #PROJECT1-PLAN1')).toBeChecked();
			});

			it('should expand projects that have monitored plans', function () {
				showPlans();

				expect($('.plan-selection-container .PROJECT1 + .plans')).toBeVisible();
			});

			it('should enable save button after plans loaded', function () {
				showPlans();

				expect($('.save-button')).not.toBeDisabled();
			});
		});
	});