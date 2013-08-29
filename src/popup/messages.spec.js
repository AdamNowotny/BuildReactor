define(['popup/messages', 'common/chromeApi'], function (messages, chromeApi) {

	'use strict';

	describe('popup/messages', function () {

		var port;
		var publishMessage;

		beforeEach(function () {
			port = {
				onMessage: {
					addListener: function () {}
				}
			};
			spyOn(chromeApi, 'connect').andReturn(port);
			spyOn(port.onMessage, 'addListener').andCallFake(function (listener) {
				publishMessage = listener;
			});
		});

		it('should connect on init', function () {
			messages.init();

			expect(chromeApi.connect).toHaveBeenCalledWith({ name: 'state' });
		});

		it('should subscribe on init', function () {
			var message;
			var settings = [];
			var subscription = messages.activeProjects.subscribe(function (state) {
				message = state;
			});

			messages.init();
			publishMessage(settings);

			subscription.dispose();
			expect(message).toBe(settings);
		});

	});

});