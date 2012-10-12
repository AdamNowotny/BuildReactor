define(['options/alert', 'jquery', 'common/timer'], function (alert, $, Timer) {

	'use strict';

	describe('alert', function () {

		beforeEach(function () {
			jasmine.getFixtures().load('settings/alertFixture.html');
		});

		it('should show alert', function () {
			spyOn(Timer.prototype, 'start');

			alert.show();

			expect($('.alert-saved .alert')).toBeVisible();
		});

		it('should hide alert after 3 seconds', function () {
			spyOn(Timer.prototype, 'start').andCallFake(function () {
				this.on.elapsed.dispatch();
			});

			alert.show();

			expect($('.alert-saved .alert')).not.toHaveClass('in');
		});
	});
});