define(['popup/messages'], function (messages) {

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
			spyOn(chrome.runtime, 'connect').andReturn(port);
			spyOn(chrome.runtime, 'sendMessage');
			spyOn(port.onMessage, 'addListener').andCallFake(function (listener) {
				publishMessage = listener;
			});
		});

		it('should connect on init', function () {
			messages.init();

			expect(chrome.runtime.connect).toHaveBeenCalledWith({ name: 'state' });
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