define([
	'options/serviceOptionsPage',
	'options/settingsFormView',
	'options/projectView',
	'jquery',
	'signals',
	'common/core'
], function (serviceOptions, settingsFormView, projectView, $, signals, core) {

	'use strict';

	describe('serviceOptionsPage', function () {

		var settingsFormContainer,
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
			spyProjectViewGet = spyOn(projectView, 'get').andReturn({
				projects: settings.projects
			});
		}

		function setupSettingsFormView() {
			spyOn(settingsFormView, 'hide');
			spySettingsFormViewShow = spyOn(settingsFormView, 'show');
			spyOn(settingsFormView, 'resetButtons');
		}

		beforeEach(function () {
			loadFixtures('src/options/serviceOptions.fixture.html');
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
			spyOn(core, 'availableProjects');
			settingsFormContainer = $('.settings-form-container');
			projectViewContainer = $('.project-selection-container');
			serviceOptions.initialize();
		});

		afterEach(function () {
			settingsFormView.on.changed.removeAll();
			settingsFormView.on.clickedShow.removeAll();
		});

		it('should show empty page', function () {
			serviceOptions.hide();

			expect(settingsFormView.hide).toHaveBeenCalled();
			expect(projectView.hide).toHaveBeenCalled();
			expect($('.alert-danger')).not.toBeVisible();
		});

		it('should hide previous errors if showing empty page', function () {
			$('.alert-danger').show();

			serviceOptions.hide();

			expect($('.alert-danger')).not.toBeVisible();
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

		it('should show service if previously hiden', function () {
			serviceOptions.show(settings);
			serviceOptions.hide();
			spySettingsFormViewShow.reset();

			serviceOptions.show(settings);

			expect(spySettingsFormViewShow).toHaveBeenCalled();
		});

		it('should show form with default updateInterval', function () {
			spySettingsFormViewShow.andCallFake(function (formValues) {
				expect(formValues.updateInterval).toBe(60);
			});
			delete settings.updateInterval;

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
			spyProjectViewGet.andReturn({ projects: ['BUILD1'] });
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
				expect(values.projects).toEqual(['BUILD1']);
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
			$('.alert-danger').show();

			settingsFormView.on.clickedShow.dispatch({});

			expect($('.alert-danger')).not.toBeVisible();
		});

		it('should hide error if shown for previous service', function () {
			$('.alert-danger').show();

			serviceOptions.show(settings);

			expect($('.alert-danger')).not.toBeVisible();
		});

		describe('show projects', function () {

			it('should send message to get available projects', function () {
				serviceOptions.show(settings);

				var formValues = { url: settings.url };
				settingsFormView.on.clickedShow.dispatch(formValues);

				expect(core.availableProjects).toHaveBeenCalled();
			});

			it('should reset buttons after projects loaded', function () {
				core.availableProjects.andCallFake(function (settings, responseFunction) {
					responseFunction({ projects: {} });
				});
				serviceOptions.show(settings);

				settingsFormView.on.clickedShow.dispatch({});

				expect(settingsFormView.resetButtons).toHaveBeenCalled();
			});

			it('should show projects after projects loaded', function () {
				var projects = {};
				core.availableProjects.andCallFake(function (settings, responseFunction) {
					responseFunction({ projects: projects });
				});
				serviceOptions.show(settings);

				settingsFormView.on.clickedShow.dispatch({});

				expect(projectView.show).toHaveBeenCalledWith(projects);
			});

			it('should reset buttons after request error', function () {
				core.availableProjects.andCallFake(function (serviceSettings, responseFunction) {
					responseFunction({ error: { message: 'error message', url: settings.url } });
				});
				serviceOptions.show(settings);

				settingsFormView.on.clickedShow.dispatch({});

				expect(settingsFormView.resetButtons).toHaveBeenCalled();
			});

			it('should display error if call failed when getting plans', function () {
				core.availableProjects.andCallFake(function (settings, responseFunction) {
					responseFunction({ error: { message: 'error message', url: 'http://error.com/' } });
				});
				serviceOptions.show(settings);

				settingsFormView.on.clickedShow.dispatch({});

				expect($('.alert-danger')).toBeVisible();
				expect($('.error-message')).toHaveText('error message');
				expect($('.error-url')).toHaveText('http://error.com/');
			});

			it('should update projects to empty array if undefined', function () {
				spySettingsFormViewShow.andCallFake(function (settings) {
					expect(settings.projects.length).toBe(0);
				});
				delete settings.projects;

				serviceOptions.show(settings);

				expect(spySettingsFormViewShow).toHaveBeenCalled();
			});

		});

	});

});