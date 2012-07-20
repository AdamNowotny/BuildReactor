define([
		'bamboo/settingsController',
		'bamboo/bambooRequest',
        'common/projectView',
		'jquery',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json'
	],
	function (controller, BambooRequest, projectView, $, jasmineSignals, jsonProjects) {

		'use strict';
		
		describe('bamboo/settingsController', function () {

			var settings;
			var mockBambooRequest;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			var mockProjectViewShow;
			var mockProjectViewGet;

			beforeEach(function () {
				settings = {
					name: 'My Bamboo CI',
					baseUrl: 'bamboo',
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
				mockProjectViewShow = spyOn(projectView, 'show');
				spyOn(projectView, 'hide');
				spyOn(projectView, 'initialize');
				mockProjectViewGet = spyOn(projectView, 'get').andCallFake(function () {
					return {
						projects: settings.plans
					};
				});
				jasmine.getFixtures().load('bamboo/settingsFixture.html');
			});

			function showPlans() {
				controller.show(settings);

				$('.plans-button').click();
			}

			it('should initialize from settings', function () {
				controller.show(settings);

				expect($('.url-input')).toHaveValue(settings.url);
				expect($('.username-input')).toHaveValue(settings.username);
				expect($('.password-input')).toHaveValue(settings.password);
				expect($('.update-interval-input')).toHaveValue(settings.updateInterval);
			});

			it('should initialize empty settings with default values', function () {
				settings.updateInterval = undefined;
				settings.plans = undefined;

				controller.show(settings);

				expect($('.update-interval-input')).toHaveValue(60);
				expect(settings.plans.length).toBe(0);
			});

			it('should initialize projectView', function () {
				controller.show(settings);

				expect(projectView.initialize).toHaveBeenCalledWith('plan-selection-container');
			});

			it('should focus on url on load', function () {
				controller.show(settings);

				expect($(document.activeElement)).toHaveClass('url-input');
			});

			it('should use url and credentials when getting plans', function () {
				mockBambooRequest.andCallFake(function () {
					expect(this.settings.username).toBe(settings.username);
					expect(this.settings.password).toBe(settings.password);
					expect(this.settings.url).toBe(settings.url);
					this.responseReceived.dispatch(jsonProjects);
				});
				controller.show(settings);

				$('.plans-button').click();

				expect(mockBambooRequest).toHaveBeenCalled();
			});

			it('should display projects after button clicked', function () {
				mockProjectViewShow.andCallFake(function (model, selectedProjects) {
					expect(model.items[0].id).toBe('PROJECT1-PLAN1');
					expect(model.items[0].name).toBe('Plan 1');
					expect(model.items[0].group).toBe('Project 1');
					expect(model.items[0].enabled).toBeTruthy();
					expect(model.items[0].selected).toBeTruthy();
				});

				showPlans();

				expect(mockProjectViewShow).toHaveBeenCalled();
			});

			it('should pass all projects and plans to projectView', function () {
				mockProjectViewShow.andCallFake(function (model, selectedProjects) {
					expect(model.items.length).toBe(5);
				});

				showPlans();

				expect(mockProjectViewShow).toHaveBeenCalled();
			});

			it('should disable button while waiting for response', function () {
				mockBambooRequest.andCallFake(function () {
					expect($('.plans-button')).toBeDisabled();
					this.responseReceived.dispatch(jsonProjects);
				});
				controller.show(settings);

				$('.plans-button').click();

				expect($('.plans-button')).not.toBeDisabled();
				expect(mockBambooRequest).toHaveBeenCalled();
			});

			it('should disable plans button if url empty', function () {
				settings.url = '';

				showPlans();

				expect($('.plans-button')).toBeDisabled();
			});

			it('should display error if call failed when getting plans', function () {
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
				expect(projectView.hide).toHaveBeenCalled();
			});

			it('should clear error when getting plans', function () {
				controller.show(settings);
				$('.error').show();

				$('.plans-button').click();

				expect($('.error')).not.toBeVisible();
			});

			it('should signal save with settings', function () {
				jasmine.getFixtures().load('bamboo/validSettingsFixture.html');
				controller.show(settings);
				var settingsSavedSpy = spyOnSignal(controller.settingsChanged).matching(function (newSettings) {
					expect(newSettings.url).toBe(settings.url);
					expect(newSettings.username).toBe(settings.username);
					expect(newSettings.password).toBe(settings.password);
					expect(newSettings.updateInterval).toBe(settings.updateInterval);
					expect(newSettings.plans[0]).toBe('PROJECT1-PLAN1');
					expect(newSettings.plans[1]).toBe('PROJECT1-PLAN2');
					return true;
				});

				$('.save-button').click();

				expect(settingsSavedSpy).toHaveBeenDispatched(1);
			});

			it('should enable save button after plans loaded', function () {
				showPlans();

				expect($('.save-button')).not.toBeDisabled();
			});

		});
	});