define([
		'jquery',
		'src/settings/removePrompt',
		'jasmineSignals'
	], function ($, serviceRemove, jasmineSignals) {
		describe('removePrompt', function () {

			var spyOnSignal = jasmineSignals.spyOnSignal;

			beforeEach(function () {
				jasmine.getFixtures().load('settings/removePromptFixture.html');
				serviceRemove.initialize();
			});

			afterEach(function () {
				serviceRemove.hide();
			});

			it('should show prompt', function () {
				serviceRemove.show('sample name');

				expect($('#service-remove-modal')).toBeVisible();
			});

			it('should show service name', function () {
				serviceRemove.show('sample name');

				expect($('#service-remove-modal .service-name')).toHaveHtml('sample name');
			});

			it('should hide prompt', function () {
				serviceRemove.show();

				serviceRemove.hide();

				expect($('#service-remove-modal')).toBeHidden();
			});

			it('should dispatch signal if remove selected', function () {
				serviceRemove.show();
				var removeSelectedSpy = spyOnSignal(serviceRemove.removeSelected);

				$('#service-remove-modal .btn-danger').click();

				expect(removeSelectedSpy).toHaveBeenDispatched();
			});

		});
	});