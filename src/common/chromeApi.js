/* global chrome: false */
define(['rx'], (Rx) => {

	function sendMessage(message, callback) {
		return callback ?
			chrome.runtime.sendMessage(message, callback) :
			chrome.runtime.sendMessage(message);
	}

	function addMessageListener(onMessage) {
		chrome.runtime.onMessage.addListener(onMessage);
	}

	function addConnectListener(onConnect) {
		chrome.runtime.onConnect.addListener(onConnect);
	}

	function connect(connectInfo) {
		return chrome.runtime.connect(connectInfo);
	}

	function isDashboardActive() {
		const queryInfo = {
			url: chrome.extension.getURL('dashboard.html')
		};
		const subject = new Rx.AsyncSubject();
		chrome.tabs.query(queryInfo, (tabs) => {
			subject.onNext(tabs.length > 0);
			subject.onCompleted();
		});
		return subject;
	}

	return {
		sendMessage,
		addMessageListener,
		addConnectListener,
		connect,
		isDashboardActive
	};
});
