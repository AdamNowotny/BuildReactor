define(['timer', 'jasmineSignals'], function (Timer, jasmineSignals) {

		describe('timer', function () {

			var timer;
			var elapsedSpy;

			beforeEach(function () {
				timer = new Timer();
				elapsedSpy = jasmineSignals.spyOnSignal(timer.elapsed);
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