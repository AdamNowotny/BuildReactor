define(['rx', 'rx.binding'], function (Rx) {

	'use strict';

	var init = function () {
		var port = chrome.runtime.connect({ name: 'state' });
		port.onMessage.addListener(function (message) {
			currentState.onNext(message);
		});
	};

	var currentState = new Rx.BehaviorSubject([]);

	return {
		init: init,
		currentState: currentState
	};
});