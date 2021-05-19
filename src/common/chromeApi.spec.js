/* global chrome: false */

import chromeApi from 'common/chromeApi';

describe('sendMessage', () => {

	const callback = () => {};
	const connectInfo = { name: 'message' };

	const connectResponse = { onMessage: { addListener: () => {} } };

	beforeEach(() => {
		spyOn(chrome.runtime, 'sendMessage');
		spyOn(chrome.runtime.onMessage, 'addListener');
		spyOn(chrome.runtime.onConnect, 'addListener');
		spyOn(chrome.runtime, 'connect').and.returnValue(connectResponse);
		spyOn(chrome.extension, 'sendMessage');
		spyOn(chrome.extension.onMessage, 'addListener');
		spyOn(chrome.extension.onConnect, 'addListener');
		spyOn(chrome.extension, 'connect').and.returnValue(connectResponse);
	});

	it('should use chrome.runtime for Chrome >= 26', () => {
		chromeApi.sendMessage('message', callback);
		chromeApi.addMessageListener(callback);
		chromeApi.addConnectListener(callback);
		const apiConnectResponse = chromeApi.connect(connectInfo);

		expect(chrome.runtime.sendMessage).toHaveBeenCalledWith('message', callback);
		expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(callback);
		expect(chrome.runtime.onConnect.addListener).toHaveBeenCalledWith(callback);
		expect(chrome.runtime.connect).toHaveBeenCalledWith(connectInfo);

		expect(apiConnectResponse).toBe(connectResponse);
	});

	describe('sendMessage', () => {

		it('should ignore callback if not specified', () => {
			chromeApi.sendMessage('message');
		
			expect(chrome.runtime.sendMessage).toHaveBeenCalledWith('message');
		});

	});

});
