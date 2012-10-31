define([
		'jquery',
		'options/removePrompt',
		'jasmineSignals'
	], function ($, removePrompt, jasmineSignals) {

		'use strict';
		
		describe('removePrompt', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;

			beforeEach(function () {
				jasmine.getFixtures().load('settings/removePromptFixture.html');
				removePrompt.initialize();
			});

			afterEach(function () {
				removePrompt.hide();
			});

			it('should show prompt', function () {
				removePrompt.show('sample name');

				expect($('#service-remove-modal')).toBeVisible();
			});

			it('should hide prompt', function () {
				removePrompt.show();

				removePrompt.hide();

				expect($('#service-remove-modal')).toBeHidden();
			});

			it('should dispatch signal if remove selected', function () {
				removePrompt.show();
				var removeSelectedSpy = spyOnSignal(removePrompt.removeSelected);

				$('#service-remove-modal .btn-danger').click();

				expect(removeSelectedSpy).toHaveBeenDispatched();
			});

			it('should close dialog on removeSelected', function () {
				removePrompt.show();

				$('#service-remove-modal .btn-danger').click();

				expect($('#service-remove-modal')).toBeHidden();
			});

		});
	});