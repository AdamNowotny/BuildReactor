define([
		'jquery',
		'src/settings/savePrompt',
		'jasmineSignals'
	], function ($, settingsSavePrompt, jasmineSignals) {
		describe('SavePrompt', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;

			beforeEach(function () {
				jasmine.getFixtures().load('settingsSavePromptFixture.html');
				settingsSavePrompt.initialize();
			});

			afterEach(function () {
				settingsSavePrompt.hide();
			});

			it('should show prompt', function () {
				settingsSavePrompt.show('sample name');

				expect($('#save-prompt')).toBeVisible();
				expect($('#save-prompt .service-name')).toHaveHtml('sample name');
			});

			it('should hide prompt', function () {
				settingsSavePrompt.show();

				settingsSavePrompt.hide();

				expect($('#save-prompt')).toBeHidden();
			});

			it('should dispatch signal if remove selected', function () {
				var removeSelectedSpy = spyOnSignal(settingsSavePrompt.removeSelected);

				$('#save-prompt .btn-danger').click();

				expect(removeSelectedSpy).toHaveBeenDispatched();
			});

		});
	});