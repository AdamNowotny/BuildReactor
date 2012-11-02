define(['common/timer', 'jasmineSignals'], function (Timer, spyOnSignal) {

	'use strict';

	describe('timer', function () {

		var timer;
		var elapsedSpy;

		beforeEach(function () {
			timer = new Timer();
			elapsedSpy = spyOnSignal(timer.on.elapsed);
		});

		it('should signal elapsed after timeout on start', function () {
			spyOn(window, 'setTimeout').andCallFake(function (func, timeout) {
				expect(timeout).toBe(5000);
				func();
			});

			timer.start(5);

			expect(elapsedSpy).toHaveBeenDispatched(1);
		});

	});
});