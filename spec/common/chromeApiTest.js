define(['common/chromeApi'], function (chromeApi) {

	'use strict';

	describe('sendMessage', function () {

		var callback = function () {};
		var connectInfo = { name: 'message' };

		var connectResponse = { onMessage: { addListener: function () {} } };

		beforeEach(function () {
			spyOn(chrome.runtime, 'sendMessage');
			spyOn(chrome.runtime.onMessage, 'addListener');
			spyOn(chrome.runtime.onConnect, 'addListener');
			spyOn(chrome.runtime, 'connect').andReturn(connectResponse);
			spyOn(chrome.extension, 'sendMessage');
			spyOn(chrome.extension.onMessage, 'addListener');
			spyOn(chrome.extension.onConnect, 'addListener');
			spyOn(chrome.extension, 'connect').andReturn(connectResponse);
		});

		it('should use chrome.runtime for Chrome >= 26', function () {
			chromeApi.sendMessage('message', callback);
			chromeApi.addMessageListener(callback);
			chromeApi.addConnectListener(callback);
			var apiConnectResponse = chromeApi.connect(connectInfo);

			expect(chrome.runtime.sendMessage).toHaveBeenCalledWith('message', callback);
			expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(callback);
			expect(chrome.runtime.onConnect.addListener).toHaveBeenCalledWith(callback);
			expect(chrome.runtime.connect).toHaveBeenCalledWith(connectInfo);

			expect(apiConnectResponse).toBe(connectResponse);
		});

		it('should use chrome.extension for Chrome < 26', function () {
			spyOn(chrome, 'runtime').andReturn(null);

			chromeApi.sendMessage('message', callback);
			chromeApi.addMessageListener(callback);
			chromeApi.addConnectListener(callback);
			chromeApi.connect(connectInfo);

			expect(chrome.extension.sendMessage).toHaveBeenCalledWith('message', callback);
			expect(chrome.extension.onMessage.addListener).toHaveBeenCalledWith(callback);
			expect(chrome.extension.onConnect.addListener).toHaveBeenCalledWith(callback);
			expect(chrome.extension.connect).toHaveBeenCalledWith(connectInfo);
		});

		describe('sendMessage', function () {

			it('should ignore callback if not specified', function () {
				chromeApi.sendMessage('message');
			
				expect(chrome.runtime.sendMessage).toHaveBeenCalledWith('message');
			});

		});
	});

});
