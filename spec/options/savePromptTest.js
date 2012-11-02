define([
		'jquery',
		'options/savePrompt',
		'jasmineSignals'
	], function ($, savePrompt, spyOnSignal) {

		'use strict';
		
		describe('savePrompt', function () {

			beforeEach(function () {
				jasmine.getFixtures().load('settings/savePromptFixture.html');
				savePrompt.initialize();
			});

			afterEach(function () {
				savePrompt.hide();
			});

			it('should show prompt', function () {
				savePrompt.show('sample name');

				expect($('#save-prompt')).toBeVisible();
			});

			it('should show service name', function () {
				savePrompt.show('sample name');

				expect($('#save-prompt .service-name')).toHaveHtml('sample name');
			});

			it('should hide prompt', function () {
				savePrompt.show();

				savePrompt.hide();

				expect($('#save-prompt')).toBeHidden();
			});

			it('should dispatch signal if remove selected', function () {
				var removeSelectedSpy = spyOnSignal(savePrompt.removeSelected);

				$('#save-prompt .btn-danger').click();

				expect(removeSelectedSpy).toHaveBeenDispatched();
			});

		});
	});