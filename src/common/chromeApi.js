define(function () {
	
	'use strict';

	var runtimeOrExtension = function () {
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

	return {
		sendMessage: sendMessage,
		addMessageListener: addMessageListener,
		addConnectListener: addConnectListener,
		connect: connect
	};
});