define([
        'src/timer',
        'SignalLogger'
    ], function (Timer, SignalLogger) {

        describe('timer', function () {

            var timer;
            var logger;

            beforeEach(function () {
                timer = new Timer();
                logger = new SignalLogger({
                    elapsed: timer.elapsed
                });
            });

            it('should signal elapsed after timeout on start', function () {
                spyOn(window, 'setTimeout').andCallFake(function (func, timeout) {
                    expect(timeout).toBe(5000);
                    func();
                });

                timer.start(5);

                expect(logger.elapsed.count).toBe(1);
            });

        });
    });