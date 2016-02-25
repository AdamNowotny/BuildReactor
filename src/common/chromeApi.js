/* global chrome: false */
define(['rx'], function(Rx) {
	
	'use strict';

	var runtimeOrExtension = function() {
		return chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
	};

	function sendMessage(message, callback) {
		return callback ?
			chrome[runtimeOrExtension()].sendMessage(message, callback) :
			chrome[runtimeOrExtension()].sendMessage(message);
	}

	function addMessageListener(onMessage) {
		chrome[runtimeOrExtension()].onMessage.addListener(onMessage);
	}
	
	function addConnectListener(onConnect) {
		chrome[runtimeOrExtension()].onConnect.addListener(onConnect);
	}

	function connect(connectInfo) {
		return chrome[runtimeOrExtension()].connect(connectInfo);
	}

	function isDashboardActive() {
		var queryInfo = {
			url: chrome.extension.getURL('dashboard.html')
		};
		var subject = new Rx.AsyncSubject();
		chrome.tabs.query(queryInfo, function(tabs) {
			subject.onNext(tabs.length > 0);
			subject.onCompleted();
		});
		return subject;
	}

	return {
		sendMessage: sendMessage,
		addMessageListener: addMessageListener,
		addConnectListener: addConnectListener,
		connect: connect,
		isDashboardActive: isDashboardActive
	};
});
