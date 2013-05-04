define(['rx', 'rx.binding'], function (Rx) {

	'use strict';

	var init = function () {
		var port = chrome.runtime.connect({ name: 'state' });
		port.onMessage.addListener(function (message) {
			activeProjects.onNext(message);
		});
	};

	var activeProjects = new Rx.BehaviorSubject([]);

	return {
		init: init,
		activeProjects: activeProjects
	};
});