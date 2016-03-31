/* global chrome: false */

define(['common/chromeApi'], function(chromeApi) {

	'use strict';

	describe('sendMessage', function() {

		var callback = function() {};
		var connectInfo = { name: 'message' };

		var connectResponse = { onMessage: { addListener: function() {} } };

		beforeEach(function() {
			spyOn(chrome.runtime, 'sendMessage');
			spyOn(chrome.runtime.onMessage, 'addListener');
			spyOn(chrome.runtime.onConnect, 'addListener');
			spyOn(chrome.runtime, 'connect').and.returnValue(connectResponse);
			spyOn(chrome.extension, 'sendMessage');
			spyOn(chrome.extension.onMessage, 'addListener');
			spyOn(chrome.extension.onConnect, 'addListener');
			spyOn(chrome.extension, 'connect').and.returnValue(connectResponse);
		});

		it('should use chrome.runtime for Chrome >= 26', function() {
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

		describe('sendMessage', function() {

			it('should ignore callback if not specified', function() {
				chromeApi.sendMessage('message');
			
				expect(chrome.runtime.sendMessage).toHaveBeenCalledWith('message');
			});

		});

		describe('isDashboardActive', function() {

			beforeEach(function() {
				spyOn(chrome.extension, 'getURL').and.callFake(function(path) {
					return 'chrome-extension://extension_id/' + path;
				});
			});

			it('should return true if dashboard tab open', function() {
				spyOn(chrome.tabs, 'query').and.callFake(function(queryInfo, callback) {
					expect(queryInfo.url).toBe('chrome-extension://extension_id/dashboard.html');
					callback([{}]);
				});

				var isActive = false;
				chromeApi.isDashboardActive().subscribe(function(result) {
					isActive = result;
				});

				expect(isActive).toBe(true);
			});
			
			it('should return false if dashboard tab closed', function() {
				spyOn(chrome.tabs, 'query').and.callFake(function(queryInfo, callback) {
					expect(queryInfo.url).toBe('chrome-extension://extension_id/dashboard.html');
					callback([]);
				});

				var isActive = false;
				chromeApi.isDashboardActive().subscribe(function(result) {
					isActive = result;
				});

				expect(isActive).toBe(false);
			});

		});
	});

});
