define([
	'jquery',
	'signals',
	'settings/serviceOptions',
	'settings/settingsFormView',
	'settings/projectView',
	'jasmineSignals',
	'spec/mocks/buildService',
	'spec/mocks/mockSettingsBuilder'
], function ($, signals, serviceOptions, settingsFormView, projectView, jasmineSignals, MockBuildService, MockSettingsBuilder) {

	'use strict';

	define('spec/buildService', function () {
		return MockBuildService;
	});

	describe('serviceOptions', function () {

		var spyOnSignal = jasmineSignals.spyOnSignal,
			settingsFormContainer,
			spySettingsFormViewShow,
			projectViewContainer,
			spyProjectViewGet,
			settings;

		var receivedProjects;
		var errorThrown;
		
		function setupProjectView() {
			spyOn(projectView, 'show');
			spyOn(projectView, 'hide');
			spyOn(projectView, 'initialize');
			spyProjectViewGet = spyOn(projectView, 'get').andCallFake(function () {
				return {
					projects: settings.projects
				};
			});
		}

		function setupSettingsFormView() {
			spyOn(settingsFormView, 'hide');
			spySettingsFormViewShow = spyOn(settingsFormView, 'show');
			spyOn(settingsFormView, 'resetButtons');
		}

		function setupBuildService() {
			receivedProjects = new signals.Signal();
			errorThrown = new signals.Signal();
			receivedProjects.memorize = true;
			errorThrown.memorize = true;
			spyOn(MockBuildService.prototype, 'projects').andCallFake(function () {
				return {
					receivedProjects: receivedProjects,
					errorThrown: errorThrown
				};
			});
		}

		beforeEach(function () {
			jasmine.getFixtures().load('settings/serviceOptionsFixture.html');
			settings = {
				name: 'My CI',
				baseUrl: 'spec',
				url: 'http://example.com/',
				updateInterval: 10,
				username: 'username1',
				password: 'password1',
				projects: ['PROJECT1-PLAN1', 'PROJECT1-PLAN2']
			};
			setupProjectView();
			setupSettingsFormView();
			setupBuildService();
			settingsFormContainer = $('.settings-form-container');
			projectViewContainer = $('.project-selection-container');
			serviceOptions.initialize();
		});

		afterEach(function () {
			settingsFormView.on.changed.removeAll();
			settingsFormView.on.clickedShow.removeAll();
		});

		it('should show empty page', function () {
			serviceOptions.show(null);

			expect(settingsFormView.hide).toHaveBeenCalled();
			expect(projectView.hide).toHaveBeenCalled();
		});

		it('should show form', function () {
			spySettingsFormViewShow.andCallFake(function (formValues) {
				expect(formValues.url).toBe(settings.url);
				expect(formValues.username).toBe(settings.username);
				expect(formValues.password).toBe(settings.password);
				expect(formValues.updateInterval).toBe(settings.updateInterval);
			});

			serviceOptions.show(settings);

			expect(spySettingsFormViewShow).toHaveBeenCalled();
		});

		it('should show form with default updateInterval', function () {
			spySettingsFormViewShow.andCallFake(function (formValues) {
				expect(formValues.updateInterval).toBe(60);
			});
			settings.updateInterval = undefined;

			serviceOptions.show(settings);

			expect(spySettingsFormViewShow).toHaveBeenCalled();
		});

		it('should initialize projectView', function () {
			serviceOptions.show(settings);

			expect(projectView.initialize).toHaveBeenCalledWith('project-selection-container');
		});

		it('should not regenerate settings page if already active', function () {
			serviceOptions.show(settings);
			spySettingsFormViewShow.reset();

			serviceOptions.show(settings);

			expect(settingsFormView.show).not.toHaveBeenCalled();
		});

		it('should signal updated when settings changed', function () {
			serviceOptions.show(settings);
			var dispatched = false;
			serviceOptions.on.updated.addOnce(function (values) {
				dispatched = true;
				expect(values.name).toBe(settings.name);
				expect(values.baseUrl).toBe(settings.baseUrl);
				expect(values.url).toBe('http://some.url/');
				expect(values.icon).toBe(settings.icon);
				expect(values.updateInterval).toBe(50);
				expect(values.username).toBe('user');
				expect(values.password).toBe('pass');
				expect(values.projects).toBe(settings.projects);
			});

			settingsFormView.on.changed.dispatch({
				url: 'http://some.url/',
				username: 'user',
				password: 'pass',
				updateInterval: 50
			});

			expect(dispatched).toBeTruthy();
		});

		it('should hide projects when show button clicked', function () {
			serviceOptions.show(settings);

			settingsFormView.on.clickedShow.dispatch({});

			expect(projectView.hide).toHaveBeenCalled();
		});

		it('should hide error when show button clicked', function () {
			serviceOptions.show(settings);
			$('.error').show();

			settingsFormView.on.clickedShow.dispatch({});

			expect($('.error')).not.toBeVisible();
		});

		it('should get projects from service', function () {
			serviceOptions.show(settings);

			var formValues = { url: settings.url };
			settingsFormView.on.clickedShow.dispatch(formValues);

			expect(MockBuildService.prototype.projects).toHaveBeenCalledWith(settings.projects);
		});

		it('should reset buttons after projects loaded', function () {
			serviceOptions.show(settings);

			settingsFormView.on.clickedShow.dispatch({});
			receivedProjects.dispatch();

			expect(settingsFormView.resetButtons).toHaveBeenCalled();
		});

		it('should show projects after projects loaded', function () {
			serviceOptions.show(settings);
			var projects = {};

			settingsFormView.on.clickedShow.dispatch({});
			receivedProjects.dispatch(projects);

			expect(projectView.show).toHaveBeenCalledWith(projects);
		});

		it('should reset buttons after request error', function () {
			serviceOptions.show(settings);

			settingsFormView.on.clickedShow.dispatch({});
			errorThrown.dispatch({ message: 'error message', url: settings.url });

			expect(settingsFormView.resetButtons).toHaveBeenCalled();
		});

		it('should display error if call failed when getting plans', function () {
			serviceOptions.show(settings);

			settingsFormView.on.clickedShow.dispatch({});
			errorThrown.dispatch({ message: 'error message', url: 'http://error.com/' });

			expect($('.alert-error')).toBeVisible();
			expect($('.error-message')).toHaveText('error message');
			expect($('.error-url')).toHaveText('http://error.com/');
		});

		it('should update projects to empty array if undefined', function () {
			settings.projects = undefined;
			serviceOptions.show(settings);

			var formValues = { url: settings.url };
			settingsFormView.on.clickedShow.dispatch(formValues);

			expect(MockBuildService.prototype.projects).toHaveBeenCalledWith([]);
		});

	});

});