define([
	'settings/settingsFormView',
	'jquery',
	'jasmineSignals'
], function (settingsFormView, $, jasmineSignals) {

	'use strict';

	describe('settingsFormView', function () {

		var form;
		var settings;
		var spyOnSignal = jasmineSignals.spyOnSignal;

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
				projects: ['AspSQLProvider', 'CruiseControl.NET']
			};
		});

		it('should show url', function () {
			form.show({ url: 'http://example.com/' });

			expect($('.url-input')).toHaveValue('http://example.com/');
		});

		it('should show update interval', function () {
			form.show({ updateInterval: 30 });

			expect($('.update-interval-input')).toHaveValue(30);
		});

		it('should show username', function () {
			form.show({ username: 'me' });

			expect($('.username-input')).toHaveValue('me');
		});

		it('should show password', function () {
			form.show({ password: 'my password' });

			expect($('.password-input')).toHaveValue('my password');
		});

		it('should disable show button if url empty', function () {
			form.show({ url: ''});

			expect($('.show-button')).toBeDisabled();
		});

		it('should focus on url on load', function () {
			form.show(settings);

			expect($(document.activeElement)).toHaveClass('url-input');
		});

		it('should signal clickedShow when Show button clicked', function () {
			form.show(settings);
			var spyClickedShow = spyOnSignal(form.on.clickedShow);
			
			$('.show-button').click();

			expect(spyClickedShow).toHaveBeenDispatched(1);
		});

		it('should signal clickedShow with current values', function () {
			form.show(settings);
			var dispatched = false;
			form.on.clickedShow.addOnce(function (currentValues) {
				dispatched = true;
				expect(currentValues.url).toBe(settings.url);
				expect(currentValues.updateInterval).toBe(settings.updateInterval);
				expect(currentValues.username).toBe(settings.username);
				expect(currentValues.password).toBe(settings.password);
			});
			
			$('.show-button').click();

			expect(dispatched).toBeTruthy();
		});

		it('should not signal clickedShow when Show button is disabled', function () {
			form.show(settings);
			var spyClickedShow = spyOnSignal(form.on.clickedShow);
			$('.show-button').attr('disabled', 'disabled');

			$('.show-button').click();

			expect(spyClickedShow).not.toHaveBeenDispatched();
		});

		it('should disable show button when clicked', function () {
			form.show(settings);
			
			$('.show-button').click();

			expect($('.show-button')).toBeDisabled();
		});
	
		it('should animate show button icon when clicked', function () {
			form.show(settings);
			
			$('.show-button').click();

			expect($('.show-button i')).toHaveClass('animate');
		});

		it('should signal changed when Save button clicked', function () {
			form.show(settings);
			var spyChanged = spyOnSignal(form.on.changed);
			
			$('.save-button').click();

			expect(spyChanged).toHaveBeenDispatched(1);
		});

		it('should signal changed with current values', function () {
			form.show(settings);
			var dispatched = false;
			form.on.changed.addOnce(function (currentValues) {
				dispatched = true;
				expect(currentValues.url).toBe(settings.url);
				expect(currentValues.updateInterval).toBe(settings.updateInterval);
				expect(currentValues.username).toBe(settings.username);
				expect(currentValues.password).toBe(settings.password);
			});
			
			$('.save-button').click();

			expect(dispatched).toBeTruthy();
		});

		it('should reset buttons', function () {
			form.show(settings);
			$('.show-button').attr('disabled', 'disabled');
			$('.show-button i').addClass('animate');
			$('.save-button').attr('disabled', 'disabled');

			form.resetButtons();

			expect($('.show-button')).not.toBeDisabled();
			expect($('.show-button i')).not.toHaveClass('animate');
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