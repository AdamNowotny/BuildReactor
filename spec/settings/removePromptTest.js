define([
		'jquery',
		'src/settings/removePrompt',
		'jasmineSignals'
	], function ($, settingsServiceRemove, jasmineSignals) {
		describe('removePrompt', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;

			beforeEach(function () {
				jasmine.getFixtures().load('settingsRemovePromptFixture.html');
				settingsServiceRemove.initialize();
			});

			afterEach(function () {
				settingsServiceRemove.hide();
			});

			it('should show prompt', function () {
				settingsServiceRemove.show('sample name');

				expect($('#service-remove-modal')).toBeVisible();
			});

			it('should show service name', function () {
				settingsServiceRemove.show('sample name');

				expect($('#service-remove-modal .service-name')).toHaveHtml('sample name');
			});

			it('should hide prompt', function () {
				settingsServiceRemove.show();

				settingsServiceRemove.hide();

				expect($('#service-remove-modal')).toBeHidden();
			});

			it('should dispatch signal if remove selected', function () {
				settingsServiceRemove.show();
				var removeSelectedSpy = spyOnSignal(settingsServiceRemove.removeSelected);

				$('#service-remove-modal .btn-danger').click();

				expect(removeSelectedSpy).toHaveBeenDispatched();
			});

		});
	});