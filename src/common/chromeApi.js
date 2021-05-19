/* global chrome: false */

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

export default {
	sendMessage,
	addMessageListener,
	addConnectListener,
	connect,
};
