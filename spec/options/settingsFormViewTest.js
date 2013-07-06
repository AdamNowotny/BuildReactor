define([
	'options/settingsFormView',
	'jquery',
	'jasmineSignals'
], function (settingsFormView, $, spyOnSignal) {

	'use strict';

	describe('settingsFormView', function () {

		var form;
		var settings;

		beforeEach(function () {
			jasmine.getFixtures().set('<div class="settings-container">content</div>');
			form = settingsFormView('.settings-container');
			settings = {
				name: 'My Bamboo CI',
				baseUrl: 'cctray',
				url: 'http://example.com/',
				updateInterval: 10,
				username: 'username1',
				password: 'password1',
				projects: ['AspSQLProvider', 'CruiseControl.NET'],
				fields: ['url', 'username', 'password', 'updateInterval']
			};
		});

		describe('fields', function () {

			it('should show url', function () {
				form.show({ url: 'http://example.com/' });

				expect($('.url-input')).toHaveValue('http://example.com/');
			});

			it('should hide url if not present', function () {
				form.show({});

				expect($('.url-input')).not.toBeVisible();
			});

			it('should show url placeholder', function () {
				form.show({ url: '', urlHint: 'http://example.com/' });

				expect($('.url-input')).toHaveAttr('placeholder', 'URL, e.g. http://example.com/');
			});

			it('should show update interval', function () {
				form.show({ updateInterval: 30 });

				expect($('.update-interval-input')).toHaveValue(30);
			});

			it('should hide update interval if not present', function () {
				form.show({});

				expect($('.update-interval-input')).not.toBeVisible();
			});

			it('should show username', function () {
				form.show({ username: 'me' });

				expect($('.username-input')).toHaveValue('me');
			});

			it('should hide username if not present', function () {
				form.show({});

				expect($('.username-input')).not.toBeVisible();
			});

			it('should show password', function () {
				form.show({ password: 'my password' });

				expect($('.password-input')).toHaveValue('my password');
			});

			it('should hide password if not present', function () {
				form.show({});

				expect($('.password-input')).not.toBeVisible();
			});

			it('should show branch', function () {
				form.show({ branch: 'ref/heads/release' });

				expect($('.branch-input')).toHaveValue('ref/heads/release');
				expect($('.branch-input')).toHaveAttr('placeholder', 'Branch, f.e. refs/heads/release');
			});

			it('should hide branch if not present', function () {
				form.show({});

				expect($('.branch-input')).not.toBeVisible();
			});

		});

		it('should focus on first input on load', function () {
			form.show({ username: '' });

			expect($(document.activeElement)).toHaveClass('username-input');
		});

		it('should signal clickedShow when Show button clicked', function () {
			form.show(settings);
			spyOnSignal(form.on.clickedShow);

			$('.show-button').click();

			expect(form.on.clickedShow).toHaveBeenDispatched(1);
		});

		it('should signal clickedShow with current values', function () {
			delete settings.url;
			form.show(settings);
			var dispatched = false;
			form.on.clickedShow.addOnce(function (currentValues) {
				dispatched = true;
				expect(currentValues.updateInterval).toBe(settings.updateInterval);
				expect(currentValues.username).toBe(settings.username);
				expect(currentValues.password).toBe(settings.password);
				expect(currentValues.url).not.toBeDefined();
			});

			$('.show-button').click();

			expect(dispatched).toBeTruthy();
		});

		it('should not signal clickedShow when Show button is disabled', function () {
			form.show(settings);
			spyOnSignal(form.on.clickedShow);
			$('.show-button').attr('disabled', 'disabled');

			$('.show-button').click();

			expect(form.on.clickedShow).not.toHaveBeenDispatched();
		});

		it('should disable show button when clicked', function () {
			form.show(settings);

			$('.show-button').click();

			expect($('.show-button')).toBeDisabled();
		});

		it('should disable show button when enter pressed', function () {
			form.show(settings);

			$('.url-input').keypress();
			// jQuery binds that to form submit
			$('.show-button').click();
			$('.url-input').keyup();

			expect($('.show-button')).toBeDisabled();
		});

		it('should animate show button icon when clicked', function () {
			form.show(settings);

			$('.show-button').click();

			expect($('.show-button i')).toHaveClass('icon-spin');
		});

		it('should signal changed when Save button clicked', function () {
			form.show(settings);
			spyOnSignal(form.on.changed);

			$('.save-button').click();

			expect(form.on.changed).toHaveBeenDispatched(1);
		});

		it('should signal changed with current values', function () {
			delete settings.updateInterval;
			form.show(settings);
			var dispatched = false;
			form.on.changed.addOnce(function (currentValues) {
				dispatched = true;
				expect(currentValues.url).toBe(settings.url);
				expect(currentValues.username).toBe(settings.username);
				expect(currentValues.password).toBe(settings.password);
				expect(currentValues.updateInterval).not.toBeDefined();
			});

			$('.save-button').click();

			expect(dispatched).toBeTruthy();
		});

		it('should reset buttons', function () {
			form.show(settings);
			$('.show-button').attr('disabled', 'disabled');
			$('.show-button i').addClass('icon-spin');
			$('.save-button').attr('disabled', 'disabled');

			form.resetButtons();

			expect($('.show-button')).not.toBeDisabled();
			expect($('.show-button i')).not.toHaveClass('icon-spin');
			expect($('.save-button')).not.toBeDisabled();
		});

		it('should hide form', function () {
			form.show(settings);

			form.hide();

			expect($('.settings-container')).toBeEmpty();
		});

		it('should show form', function () {
			form.hide();

			form.show(settings);

			expect($('.settings-container')).toBeVisible();
		});

		it('should unsubscribe previous signal handlers when showing new service', function () {
			form.show(settings);

			var spyClickedShow = spyOnSignal(form.on.clickedShow);
			var spyChanged = spyOnSignal(form.on.changed);
			form.show(settings);

			expect(spyClickedShow).not.toHaveBeenDispatched();
			expect(spyChanged).not.toHaveBeenDispatched();
		});

	});

});